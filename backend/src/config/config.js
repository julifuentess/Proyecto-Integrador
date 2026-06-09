const config = {
  port: process.env.PORT || 3001,
  authProvider: process.env.AUTH_PROVIDER || "keycloak",
  jwtSecret: process.env.JWT_SECRET || "dds-reservas-aulas-test-secret",
  keycloak: {
    url: process.env.KEYCLOAK_URL || "https://labsys.frc.utn.edu.ar/aim",
    realm: process.env.KEYCLOAK_REALM || "dds-materia",
    clientId: process.env.KEYCLOAK_CLIENT_ID || "grupo22",
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
