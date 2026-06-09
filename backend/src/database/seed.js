import { initializeDatabase, seedDatabase, sequelize } from "../data/database.js";

try {
  await initializeDatabase({ force: false, seed: false });
  await seedDatabase({ force: false });
  console.log("Datos semilla cargados correctamente.");
} catch (error) {
  console.error("No se pudieron cargar los datos semilla:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
