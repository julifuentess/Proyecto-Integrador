import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";
import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = config.database.storage || path.join(__dirname, "../../data/reservas.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: config.database.logging ? console.log : false
});

export default sequelize;
