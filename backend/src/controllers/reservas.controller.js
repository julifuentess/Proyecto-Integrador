import * as reservasService from "../services/reservas.service.js";

async function list(req, res, next) {
  try {
    res.status(200).json(await reservasService.listReservas(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

async function resumen(req, res, next) {
  try {
    res.status(200).json(await reservasService.getResumen());
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    res.status(200).json(await reservasService.getReservaForUser(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

async function historial(req, res, next) {
  try {
    res.status(200).json(await reservasService.getHistorial(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await reservasService.createReserva(req.body, req.user));
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    res.status(200).json(await reservasService.updateReserva(req.params.id, req.body, req.user));
  } catch (error) {
    next(error);
  }
}

async function cancelar(req, res, next) {
  try {
    res.status(200).json(await reservasService.changeEstado(req.params.id, "cancelada", req.user));
  } catch (error) {
    next(error);
  }
}

async function aprobar(req, res, next) {
  try {
    res.status(200).json(await reservasService.changeEstado(req.params.id, "aprobada", req.user));
  } catch (error) {
    next(error);
  }
}

async function rechazar(req, res, next) {
  try {
    res.status(200).json(await reservasService.changeEstado(req.params.id, "rechazada", req.user));
  } catch (error) {
    next(error);
  }
}

export { aprobar, cancelar, create, detail, historial, list, rechazar, resumen, update };
