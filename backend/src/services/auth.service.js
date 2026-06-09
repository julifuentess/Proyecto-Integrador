import config from "../config/config.js";

function getKeycloakAuthInfo(action) {
  return {
    message: `La operacion de ${action} se realiza desde Keycloak`,
    authProvider: "keycloak",
    keycloak: {
      url: config.keycloak.url,
      realm: config.keycloak.realm,
      clientId: config.keycloak.clientId
    }
  };
}

async function register() {
  return getKeycloakAuthInfo("registro");
}

async function login() {
  return getKeycloakAuthInfo("inicio de sesion");
}

export { login, register };
