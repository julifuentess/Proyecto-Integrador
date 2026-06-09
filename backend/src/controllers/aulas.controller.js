import * as aulasService from "../services/aulas.service.js";

async function list(req, res, next) {
  try {
    res.status(200).json(await aulasService.listAulas());
  } catch (error) {
    next(error);
  }
}

export { list };
