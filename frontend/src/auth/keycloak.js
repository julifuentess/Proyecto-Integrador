import Keycloak from "keycloak-js";

// Configuracion del cliente publico creado en Keycloak.
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "https://labsys.frc.utn.edu.ar/aim",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "dds-materia",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "grupo22"
});

let initPromise;

// Inicializa Keycloak con check-sso para restaurar sesion si ya existe en el navegador.
export function initKeycloak() {
  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
    });
  }
  return initPromise;
}

// Renueva el access token antes de llamar a la API.
export async function getToken() {
  if (!keycloak.authenticated) return null;
  await keycloak.updateToken(30);
  return keycloak.token;
}

// Convierte tokenParsed en el usuario que usa la aplicacion.
export function getUserFromToken() {
  const token = keycloak.tokenParsed;
  if (!token) return null;

  const realmRoles = token.realm_access?.roles || [];
  const clientRoles = token.resource_access?.[keycloak.clientId]?.roles || [];
  const roles = [...realmRoles, ...clientRoles];

  return {
    id: token.sub,
    keycloakId: token.sub,
    nombre: token.name || token.preferred_username || token.email,
    email: token.email,
    rol: roles.includes("admin") ? "admin" : "usuario"
  };
}

export default keycloak;