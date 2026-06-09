import { initializeDatabase, sequelize } from "../data/database.js";

try {
  await initializeDatabase({ force: false, seed: false });
  console.log("Migraciones aplicadas correctamente.");
} catch (error) {
  console.error("No se pudieron aplicar las migraciones:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
