import apiClient from "../api/apiClient.js";

// Servicio separado para no mezclar llamadas HTTP dentro de los componentes.
export function login(credentials) {
  return apiClient.post("/auth/login", credentials).then((response) => response.data);
}

export function register(data) {
  return apiClient.post("/auth/register", data).then((response) => response.data);
}

