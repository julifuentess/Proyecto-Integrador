import apiClient from "../api/apiClient.js";

// El listado envía filtros, paginación y ordenamiento como params.
export function listReservas(params) {
  return apiClient.get("/reservas", { params }).then((response) => response.data);
}

export function getReserva(id) {
  return apiClient.get(`/reservas/${id}`).then((response) => response.data);
}

export function getHistorial(id) {
  return apiClient.get(`/reservas/${id}/historial`).then((response) => response.data);
}

export function createReserva(data) {
  return apiClient.post("/reservas", data).then((response) => response.data);
}

export function updateReserva(id, data) {
  return apiClient.put(`/reservas/${id}`, data).then((response) => response.data);
}

export function cancelarReserva(id) {
  return apiClient.patch(`/reservas/${id}/cancelar`).then((response) => response.data);
}

export function aprobarReserva(id) {
  return apiClient.patch(`/reservas/${id}/aprobar`).then((response) => response.data);
}

export function rechazarReserva(id) {
  return apiClient.patch(`/reservas/${id}/rechazar`).then((response) => response.data);
}

export function getResumen() {
  return apiClient.get("/reservas/resumen").then((response) => response.data);
}

