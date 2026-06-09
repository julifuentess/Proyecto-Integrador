const config = {
  port: process.env.PORT || 3001,
  authProvider: process.env.AUTH_PROVIDER || "keycloak",
  jwtSecret: process.env.JWT_SECRET || "dds-reservas-aulas-test-secret",
  keycloak: {
    url: process.env.KEYCLOAK_URL || "http://localhost:8080",
    realm: process.env.KEYCLOAK_REALM || "reservas-aulas",
    clientId: process.env.KEYCLOAK_CLIENT_ID || "reservas-frontend",
    audience: process.env.KEYCLOAK_AUDIENCE || ""
  },
  database: {
    storage: process.env.SQLITE_STORAGE || process.env.DB_PATH || "data/reservas.sqlite",
    logging: process.env.DB_LOGGING === "true"
  },
  horarioLaboral: {
    inicio: process.env.HORARIO_INICIO || "08:00",
    fin: process.env.HORARIO_FIN || "22:00"
  }
};

export default config;
