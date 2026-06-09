import { Op } from "sequelize";
import config from "../config/config.js";
import sequelize from "../database/sequelize.js";
import { Aula, HistorialReserva, Reserva, Usuario } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { overlaps, toMinutes } from "../utils/time.js";

const estadosQueBloquean = ["pendiente", "aprobada"];
const estadosFinales = ["cancelada", "rechazada"];

function toPlain(model) {
  return model?.get ? model.get({ plain: true }) : model;
}

function buildReservaInclude() {
  return [
    { model: Aula, as: "aula" },
    { model: Usuario, as: "usuario", attributes: ["id", "keycloakId", "nombre", "email", "rol", "activo"] }
  ];
}

function buildAllowedReservaData(source, current = {}) {
  return {
    aulaId: source.aulaId ?? current.aulaId,
    fecha: source.fecha ?? current.fecha,
    horaInicio: source.horaInicio ?? current.horaInicio,
    horaFin: source.horaFin ?? current.horaFin,
    cantidadPersonas:
      source.cantidadPersonas !== undefined ? Number(source.cantidadPersonas) : Number(current.cantidadPersonas),
    motivo: source.motivo ?? current.motivo,
    estado: source.estado ?? current.estado
  };
}

async function getReservaForUser(id, currentUser) {
  const reserva = await Reserva.findByPk(id, { include: buildReservaInclude() });
  if (!reserva) {
    throw new AppError("Reserva inexistente", 404);
  }

  const plain = toPlain(reserva);
  if (currentUser.rol !== "admin" && plain.usuarioId !== currentUser.id) {
    throw new AppError("No tenes permisos para ver esta reserva", 403);
  }

  return plain;
}

async function listReservas(query, currentUser) {
  const {
    fecha,
    estado,
    aulaId,
    q,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc"
  } = query;

  const where = {};
  if (currentUser.rol !== "admin") where.usuarioId = currentUser.id;
  if (fecha) where.fecha = fecha;
  if (estado) where.estado = estado;
  if (aulaId) where.aulaId = aulaId;
  if (q) where.motivo = { [Op.like]: `%${q}%` };

  const allowedSorts = ["fecha", "horaInicio", "estado", "createdAt", "cantidadPersonas"];
  const selectedSort = allowedSorts.includes(sortBy) ? sortBy : "createdAt";
  const selectedOrder = order === "asc" ? "ASC" : "DESC";
  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.max(Number(limit) || 10, 1);

  const { rows, count } = await Reserva.findAndCountAll({
    where,
    include: buildReservaInclude(),
    order: [[selectedSort, selectedOrder]],
    offset: (numericPage - 1) * numericLimit,
    limit: numericLimit,
    distinct: true
  });

  return {
    data: rows.map(toPlain),
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total: count,
      totalPages: Math.ceil(count / numericLimit)
    }
  };
}

async function validateBusinessRules(reservaData, ignoreReservaId = null, transaction = null) {
  const aula = await Aula.findByPk(reservaData.aulaId, { transaction });
  if (!aula) {
    throw new AppError("El aula indicada no existe", 400);
  }
  if (!aula.activa) {
    throw new AppError("El aula indicada no esta activa", 400);
  }
  if (Number(reservaData.cantidadPersonas) > aula.capacidad) {
    throw new AppError("El aula no tiene capacidad suficiente", 400);
  }
  if (toMinutes(reservaData.horaInicio) >= toMinutes(reservaData.horaFin)) {
    throw new AppError("La hora de inicio debe ser menor que la hora de fin", 400);
  }
  if (
    toMinutes(reservaData.horaInicio) < toMinutes(config.horarioLaboral.inicio) ||
    toMinutes(reservaData.horaFin) > toMinutes(config.horarioLaboral.fin)
  ) {
    throw new AppError(`El horario debe estar dentro de ${config.horarioLaboral.inicio} a ${config.horarioLaboral.fin}`, 400);
  }

  const where = {
    aulaId: reservaData.aulaId,
    fecha: reservaData.fecha,
    estado: { [Op.in]: estadosQueBloquean }
  };
  if (ignoreReservaId) {
    where.id = { [Op.ne]: ignoreReservaId };
  }

  const reservasDelDia = await Reserva.findAll({ where, transaction });
  const conflict = reservasDelDia.find((reserva) =>
    overlaps(reservaData.horaInicio, reservaData.horaFin, reserva.horaInicio, reserva.horaFin)
  );

  if (conflict) {
    throw new AppError("La reserva se superpone con otra reserva pendiente o aprobada", 400);
  }
}

async function addHistory(reservaId, userId, accion, valorAnterior, valorNuevo, transaction) {
  return HistorialReserva.create(
    {
      id: `hist-${Date.now()}-${Math.round(Math.random() * 100000)}`,
      reservaId,
      usuarioId: userId,
      accion,
      fechaHora: new Date(),
      valorAnterior,
      valorNuevo
    },
    { transaction }
  );
}

async function createReserva(body, currentUser) {
  const created = await sequelize.transaction(async (transaction) => {
    const reservaData = {
      aulaId: body.aulaId,
      usuarioId: currentUser.id,
      fecha: body.fecha,
      horaInicio: body.horaInicio,
      horaFin: body.horaFin,
      cantidadPersonas: Number(body.cantidadPersonas),
      motivo: body.motivo,
      estado: "pendiente"
    };

    await validateBusinessRules(reservaData, null, transaction);

    const reserva = await Reserva.create(
      {
        id: `res-${Date.now()}`,
        ...reservaData
      },
      { transaction }
    );

    await addHistory(reserva.id, currentUser.id, "creacion", null, toPlain(reserva), transaction);
    return reserva;
  });

  return getReservaForUser(created.id, currentUser);
}

function validateStateTransition(from, to) {
  const allowed = {
    pendiente: ["aprobada", "rechazada", "cancelada"],
    aprobada: ["cancelada"],
    rechazada: [],
    cancelada: []
  };

  if (!allowed[from] || !allowed[from].includes(to)) {
    throw new AppError("Transicion de estado no permitida", 400);
  }
}

async function updateReserva(id, body, currentUser) {
  const updated = await sequelize.transaction(async (transaction) => {
    const reserva = await Reserva.findByPk(id, { transaction });
    if (!reserva) {
      throw new AppError("Reserva inexistente", 404);
    }

    const current = toPlain(reserva);
    const isOwner = current.usuarioId === currentUser.id;
    const isAdmin = currentUser.rol === "admin";

    if (!isAdmin && (!isOwner || current.estado !== "pendiente")) {
      throw new AppError("No tenes permisos para editar esta reserva", 403);
    }
    if (!isAdmin && body.estado) {
      throw new AppError("No tenes permisos para cambiar el estado", 403);
    }
    if (estadosFinales.includes(current.estado)) {
      throw new AppError("No se puede modificar una reserva cancelada o rechazada", 400);
    }

    const nextReserva = buildAllowedReservaData(body, current);
    await validateBusinessRules(nextReserva, id, transaction);

    if (body.estado && body.estado !== current.estado) {
      validateStateTransition(current.estado, body.estado);
    }

    await reserva.update(nextReserva, { transaction });
    await addHistory(id, currentUser.id, "edicion", current, toPlain(reserva), transaction);
    return reserva;
  });

  return getReservaForUser(updated.id, currentUser);
}

async function changeEstado(id, nextEstado, currentUser) {
  const updated = await sequelize.transaction(async (transaction) => {
    const reserva = await Reserva.findByPk(id, { transaction });
    if (!reserva) {
      throw new AppError("Reserva inexistente", 404);
    }

    const current = toPlain(reserva);
    const isOwner = current.usuarioId === currentUser.id;
    const isAdmin = currentUser.rol === "admin";

    if (nextEstado === "cancelada") {
      if (!isAdmin && !isOwner) {
        throw new AppError("No tenes permisos para cancelar esta reserva", 403);
      }
    } else if (!isAdmin) {
      throw new AppError("No tenes permisos para realizar esta accion", 403);
    }

    validateStateTransition(current.estado, nextEstado);

    await reserva.update({ estado: nextEstado }, { transaction });
    const accion = nextEstado === "aprobada" ? "aprobacion" : nextEstado === "rechazada" ? "rechazo" : "cancelacion";
    await addHistory(id, currentUser.id, accion, { estado: current.estado }, { estado: nextEstado }, transaction);
    return reserva;
  });

  return getReservaForUser(updated.id, currentUser);
}

async function getHistorial(id, currentUser) {
  const reserva = await Reserva.findByPk(id);
  if (!reserva) {
    throw new AppError("Reserva inexistente", 404);
  }
  if (currentUser.rol !== "admin" && reserva.usuarioId !== currentUser.id) {
    throw new AppError("No tenes permisos para ver este historial", 403);
  }

  const historial = await HistorialReserva.findAll({
    where: { reservaId: id },
    include: [{ model: Usuario, as: "usuario", attributes: ["id", "keycloakId", "nombre", "email", "rol", "activo"] }],
    order: [["fechaHora", "ASC"]]
  });

  return historial.map(toPlain);
}

async function getResumen() {
  const reservas = await Reserva.findAll({ include: buildReservaInclude() });
  const aulas = await Aula.findAll();

  const reservasPlain = reservas.map(toPlain);
  const porEstado = reservasPlain.reduce((acc, reserva) => {
    acc[reserva.estado] = (acc[reserva.estado] || 0) + 1;
    return acc;
  }, {});

  const ocupacionPorAula = aulas
    .map((aulaModel) => {
      const aula = toPlain(aulaModel);
      const reservasAula = reservasPlain.filter((reserva) => reserva.aulaId === aula.id);
      const totalPersonas = reservasAula.reduce((sum, reserva) => sum + Number(reserva.cantidadPersonas), 0);
      return {
        aulaId: aula.id,
        nombre: aula.nombre,
        cantidadReservas: reservasAula.length,
        ocupacionPromedio: reservasAula.length ? Math.round(totalPersonas / reservasAula.length) : 0
      };
    })
    .sort((a, b) => b.cantidadReservas - a.cantidadReservas);

  const today = new Date().toISOString().slice(0, 10);
  const proximasDelDia = reservasPlain
    .filter((reserva) => reserva.fecha >= today && estadosQueBloquean.includes(reserva.estado))
    .sort((a, b) => `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`))
    .slice(0, 5);

  return {
    porEstado,
    ocupacionPorAula,
    proximasDelDia
  };
}

export {
  changeEstado,
  createReserva,
  getHistorial,
  getReservaForUser,
  getResumen,
  listReservas,
  updateReserva
};
