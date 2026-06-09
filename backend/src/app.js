import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import aulasRoutes from "./routes/aulas.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/aulas", aulasRoutes);
app.use("/api/reservas", reservasRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use(errorMiddleware);

export default app;
