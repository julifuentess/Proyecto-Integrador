import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import config from "../config/config.js";
import { Usuario } from "../models/index.js";
import AppError from "../utils/AppError.js";

const jwksClient = jwksRsa({
  jwksUri: `${config.keycloak.url}/realms/${config.keycloak.realm}/protocol/openid-connect/certs`,
  cache: true,
  rateLimit: true
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (error, key) => {
    if (error) return callback(error);
    callback(null, key.getPublicKey());
  });
}

function verifyKeycloakToken(token) {
  const options = {
    algorithms: ["RS256"],
    issuer: `${config.keycloak.url}/realms/${config.keycloak.realm}`
  };

  if (config.keycloak.audience) {
    options.audience = config.keycloak.audience;
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (error, payload) => {
      if (error) return reject(error);
      resolve(payload);
    });
  });
}

function getRoleFromPayload(payload) {
  const realmRoles = payload.realm_access?.roles || [];
  const clientRoles = payload.resource_access?.[config.keycloak.clientId]?.roles || [];
  const roles = [...realmRoles, ...clientRoles];

  if (roles.includes("admin")) return "admin";
  return "usuario";
}

function publicUser(user) {
  return {
    id: user.id,
    keycloakId: user.keycloakId,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  };
}

async function authenticateLocalTestToken(token) {
  const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
  const user = await Usuario.findOne({
    where: {
      id: payload.id,
      activo: true
    }
  });

  if (!user) {
    throw new AppError("Usuario inexistente o inactivo", 401);
  }

  return publicUser(user);
}

async function syncUserFromKeycloak(payload) {
  const email = String(payload.email || payload.preferred_username || "").toLowerCase();
  const rol = getRoleFromPayload(payload);

  let user = await Usuario.findOne({ where: { keycloakId: payload.sub } });
  if (!user && email) {
    user = await Usuario.findOne({ where: { email } });
  }

  const userData = {
    keycloakId: payload.sub,
    nombre: payload.name || payload.preferred_username || email || "Usuario Keycloak",
    email,
    rol,
    activo: true
  };

  if (user) {
    await user.update(userData);
  } else {
    user = await Usuario.create({
      id: `usr-${Date.now()}`,
      ...userData
    });
  }

  return publicUser(user);
}

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("No se envio JWT", 401);
    }

    const token = header.replace("Bearer ", "");

    if (config.authProvider === "local-test") {
      req.user = await authenticateLocalTestToken(token);
    } else {
      const payload = await verifyKeycloakToken(token);
      req.user = await syncUserFromKeycloak(payload);
    }

    next();
  } catch (error) {
    next(error.status ? error : new AppError("JWT invalido o vencido", 401));
  }
}

export default authenticate;
