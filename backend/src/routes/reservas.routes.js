import express from "express";
import * as reservasController from "../controllers/reservas.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { validateCreateReserva, validateUpdateReserva } from "../validations/reserva.validation.js";

const router = express.Router();

router.use(authenticate);

router.get("/", reservasController.list);
router.get("/resumen", requireRole("admin"), reservasController.resumen);
router.get("/:id", reservasController.detail);
router.get("/:id/historial", reservasController.historial);
router.post("/", validate(validateCreateReserva), reservasController.create);
router.put("/:id", validate(validateUpdateReserva), reservasController.update);
router.patch("/:id/cancelar", reservasController.cancelar);
router.patch("/:id/aprobar", requireRole("admin"), reservasController.aprobar);
router.patch("/:id/rechazar", requireRole("admin"), reservasController.rechazar);

export default router;
