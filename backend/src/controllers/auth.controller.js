import * as authService from "../services/auth.service.js";

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export { login, register };
