import { Aula } from "../models/index.js";

async function listAulas() {
  const aulas = await Aula.findAll({
    order: [["nombre", "ASC"]]
  });

  return aulas.map((aula) => aula.get({ plain: true }));
}

export { listAulas };
