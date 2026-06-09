import { resetDatabase, sequelize } from "../data/database.js";

try {
  await resetDatabase();
  console.log("Base SQLite reiniciada y sembrada correctamente.");
} catch (error) {
  console.error("No se pudo reiniciar la base:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
