import fs from "node:fs";
import path from "node:path";
import sequelize from "../database/sequelize.js";
import seedData from "./seedData.js";
import { Aula, HistorialReserva, Reserva, Usuario } from "../models/index.js";

function ensureStorageFolder() {
  const storage = sequelize.options.storage;
  if (storage && storage !== ":memory:") {
    fs.mkdirSync(path.dirname(storage), { recursive: true });
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function seedDatabase({ force = false } = {}) {
  const usersCount = await Usuario.count();
  if (usersCount > 0 && !force) return;

  const data = clone(seedData);

  await sequelize.transaction(async (transaction) => {
    if (force) {
      await HistorialReserva.destroy({ where: {}, transaction });
      await Reserva.destroy({ where: {}, transaction });
      await Aula.destroy({ where: {}, transaction });
      await Usuario.destroy({ where: {}, transaction });
    }

    await Usuario.bulkCreate(data.usuarios, { transaction });
    await Aula.bulkCreate(data.aulas, { transaction });
    await Reserva.bulkCreate(data.reservas, { transaction });
    await HistorialReserva.bulkCreate(data.historial_reservas, { transaction });
  });
}

export async function initializeDatabase({ force = false, seed = true } = {}) {
  ensureStorageFolder();
  await sequelize.authenticate();
  await sequelize.sync({ force });
  if (seed) {
    await seedDatabase({ force });
  }
}

export async function resetDatabase() {
  await initializeDatabase({ force: true, seed: true });
}

export { seedDatabase, sequelize };
