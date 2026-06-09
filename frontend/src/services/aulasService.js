import apiClient from "../api/apiClient.js";

// GET /api/aulas carga las opciones reales del formulario de reserva.
export function listAulas() {
  return apiClient.get("/aulas").then((response) => response.data);
}

