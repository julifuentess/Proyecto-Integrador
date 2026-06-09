import app from "./app.js";
import config from "./config/config.js";
import { initializeDatabase } from "./data/database.js";

try {
  await initializeDatabase();

  app.listen(config.port, () => {
    console.log(`Backend escuchando en http://localhost:${config.port}`);
  });
} catch (error) {
  console.error("No se pudo iniciar el backend:", error);
  process.exit(1);
}
