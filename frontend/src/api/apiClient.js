import axios from "axios";
import { getToken } from "../auth/keycloak.js";

// Instancia Axios con baseURL, tal como pide el enunciado.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api"
});

// El interceptor agrega Authorization: Bearer <token> usando el token emitido por Keycloak.
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza errores para que las pantallas muestren mensajes comprensibles.
export function getApiError(error) {
  return error.response?.data?.error || "No se pudo completar la operacion";
}

export default apiClient;

