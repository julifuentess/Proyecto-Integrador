import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import request from "supertest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.SQLITE_STORAGE = path.join(__dirname, "test.sqlite");
process.env.JWT_SECRET = "test-secret";
process.env.AUTH_PROVIDER = "local-test";

const { default: app } = await import("../src/app.js");
const { resetDatabase, sequelize } = await import("../src/data/database.js");

let adminToken;
let userToken;

function createToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
}

beforeEach(async () => {
  await resetDatabase();
  adminToken = createToken({ id: "usr-admin", email: "admin@dds.com", rol: "admin" });
  userToken = createToken({ id: "usr-001", email: "ana@dds.com", rol: "usuario" });
});

afterAll(async () => {
  await sequelize.close();
});

test("login local queda delegado a Keycloak", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@dds.com", password: "Admin123!" });

  expect(response.status).toBe(200);
  expect(response.body.authProvider).toBe("keycloak");
  expect(response.body.keycloak.realm).toBe("dds-materia");
});

test("listado de reservas sin filtros devuelve paginacion", async () => {
  const response = await request(app)
    .get("/api/reservas")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBeGreaterThan(0);
  expect(response.body.pagination.total).toBe(10);
});

test("listado de reservas con filtro por estado devuelve solo coincidencias", async () => {
  const response = await request(app)
    .get("/api/reservas?estado=pendiente")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.status).toBe(200);
  expect(response.body.data.every((reserva) => reserva.estado === "pendiente")).toBe(true);
});

test("detalle existente devuelve la reserva", async () => {
  const response = await request(app)
    .get("/api/reservas/res-1001")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.status).toBe(200);
  expect(response.body.id).toBe("res-1001");
  expect(response.body.aula.id).toBe("aula-910");
});

test("detalle inexistente devuelve 404", async () => {
  const response = await request(app)
    .get("/api/reservas/res-no-existe")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.status).toBe(404);
  expect(response.body.error).toBe("Reserva inexistente");
});

test("creacion valida de reserva devuelve 201 y registra historial", async () => {
  const response = await request(app)
    .post("/api/reservas")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      aulaId: "aula-101",
      fecha: "2026-07-01",
      horaInicio: "10:00",
      horaFin: "12:00",
      cantidadPersonas: 20,
      motivo: "Clase de repaso"
    });

  expect(response.status).toBe(201);
  expect(response.body.estado).toBe("pendiente");
  expect(response.body.usuarioId).toBe("usr-001");

  const historial = await request(app)
    .get(`/api/reservas/${response.body.id}/historial`)
    .set("Authorization", `Bearer ${userToken}`);

  expect(historial.status).toBe(200);
  expect(historial.body.some((item) => item.accion === "creacion")).toBe(true);
});

test("creacion invalida por capacidad insuficiente devuelve 400", async () => {
  const response = await request(app)
    .post("/api/reservas")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      aulaId: "aula-101",
      fecha: "2026-07-02",
      horaInicio: "10:00",
      horaFin: "12:00",
      cantidadPersonas: 99,
      motivo: "Clase masiva"
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("El aula no tiene capacidad suficiente");
});

test("creacion invalida por superposicion horaria devuelve 400", async () => {
  const response = await request(app)
    .post("/api/reservas")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      aulaId: "aula-910",
      fecha: "2026-06-18",
      horaInicio: "10:00",
      horaFin: "12:00",
      cantidadPersonas: 20,
      motivo: "Reserva solapada"
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("La reserva se superpone con otra reserva pendiente o aprobada");
});

test("acceso sin JWT a ruta protegida devuelve 401", async () => {
  const response = await request(app).post("/api/reservas").send({});

  expect(response.status).toBe(401);
  expect(response.body.error).toBe("No se envio JWT");
});

test("usuario comun no puede aprobar una reserva", async () => {
  const response = await request(app)
    .patch("/api/reservas/res-1001/aprobar")
    .set("Authorization", `Bearer ${userToken}`);

  expect(response.status).toBe(403);
  expect(response.body.error).toBe("No tenes permisos para realizar esta accion");
});

test("edicion invalida que genera conflicto de horario devuelve 400", async () => {
  const response = await request(app)
    .put("/api/reservas/res-1006")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      aulaId: "aula-910",
      fecha: "2026-06-18",
      horaInicio: "10:30",
      horaFin: "12:30",
      cantidadPersonas: 20,
      motivo: "Cambio con conflicto"
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("La reserva se superpone con otra reserva pendiente o aprobada");
});

test("transicion no permitida al aprobar una cancelada devuelve 400", async () => {
  const response = await request(app)
    .patch("/api/reservas/res-1004/aprobar")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Transicion de estado no permitida");
});
