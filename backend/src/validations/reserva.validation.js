import { isTimeFormat } from "../utils/time.js";

// Campos que debe traer una creación de reserva.
function validateCreateReserva(req) {
  const required = ["aulaId", "fecha", "horaInicio", "horaFin", "cantidadPersonas", "motivo"];
  const missing = required.find((field) => req.body[field] === undefined || req.body[field] === "");
  if (missing) {
    return `El campo ${missing} es obligatorio`;
  }
  return validateReservaShape(req.body);
}

// En edición se aceptan campos parciales, pero si llegan deben tener formato correcto.
function validateUpdateReserva(req) {
  if (!Object.keys(req.body).length) {
    return "Debe enviar al menos un campo para editar";
  }
  return validateReservaShape(req.body);
}

// Reglas de forma: las reglas de negocio quedan en el servicio.
function validateReservaShape(body) {
  if (body.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(body.fecha)) {
    return "La fecha debe tener formato YYYY-MM-DD";
  }
  if (body.horaInicio && !isTimeFormat(body.horaInicio)) {
    return "La hora de inicio debe tener formato HH:mm";
  }
  if (body.horaFin && !isTimeFormat(body.horaFin)) {
    return "La hora de fin debe tener formato HH:mm";
  }
  if (body.cantidadPersonas !== undefined && Number(body.cantidadPersonas) <= 0) {
    return "La cantidad de personas debe ser mayor a cero";
  }
  if (body.estado && !["pendiente", "aprobada", "rechazada", "cancelada"].includes(body.estado)) {
    return "El estado indicado no es válido";
  }
  return null;
}

export { validateCreateReserva, validateUpdateReserva };
