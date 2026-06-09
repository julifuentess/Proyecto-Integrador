import express from "express";
import * as aulasController from "../controllers/aulas.controller.js";

const router = express.Router();

router.get("/", aulasController.list);

export default router;
