# Sistema de reservas de aulas

Aplicacion full stack para gestionar reservas de aulas con backend Node.js/Express, frontend React/Vite, persistencia SQLite con Sequelize y autenticacion delegada en Keycloak.

## Estado de la implementacion

Esta version migra el proyecto a ES Modules, reemplaza la persistencia previa por SQLite/Sequelize, elimina la autenticacion local como fuente real de identidad, integra validacion de JWT emitidos por Keycloak, conserva la arquitectura por capas y fortalece las reglas de negocio de reservas.

## Arquitectura general

```text
frontend React/Vite
  -> keycloak-js obtiene sesion y access token
  -> Axios envia Authorization: Bearer <token>

backend Express
  -> middlewares validan JWT, roles, entrada y errores
  -> rutas delegan en controladores
  -> controladores delegan en servicios
  -> servicios aplican reglas de negocio
  -> modelos Sequelize persisten en SQLite

Keycloak
  -> gestiona login, registro, usuarios, roles y emision de JWT
```

## Tecnologias

- Backend: Node.js, Express, Express Router, ES Modules, Sequelize, SQLite, jwks-rsa, jsonwebtoken, Jest y Supertest.
- Frontend: React, Vite, React Router, Axios y keycloak-js.
- Identidad: Keycloak ejecutado con Docker.
- Persistencia: SQLite mediante Sequelize ORM.

## Requisitos previos

- Node.js 18 o superior.
- npm.
- Docker y Docker Compose.
- Puertos libres: `8080` para Keycloak, `3001` para backend y `5173` para frontend.

## Instalacion

Desde la raiz del proyecto:

```bash
docker compose up -d keycloak
```

Instalar backend:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Instalar frontend en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001/api`
- Keycloak: `http://localhost:8080`

## Variables de entorno

Backend:

```env
PORT=3001
AUTH_PROVIDER=keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=reservas-aulas
KEYCLOAK_CLIENT_ID=reservas-frontend
KEYCLOAK_AUDIENCE=
SQLITE_STORAGE=data/reservas.sqlite
HORARIO_INICIO=08:00
HORARIO_FIN=22:00
DB_LOGGING=false
```

Frontend:

```env
VITE_API_URL=http://localhost:3001/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=reservas-aulas
VITE_KEYCLOAK_CLIENT_ID=reservas-frontend
```

## Keycloak

El servicio se levanta con `docker-compose.yml` y carga `keycloak/realm-export.json`.

Consola de administracion:

- URL: `http://localhost:8080`
- Usuario admin: `admin`
- Password admin: `admin`

Realm importado:

- Nombre: `reservas-aulas`
- Registro habilitado: si.
- Roles de realm: `admin`, `usuario`.
- Cliente publico: `reservas-frontend`.
- Redirect URI: `http://localhost:5173/*`.
- Web origin: `http://localhost:5173`.
- PKCE: `S256`.

Usuarios de prueba cargados en Keycloak:

- `admin@dds.com` / `Admin123!` con rol `admin`.
- `ana@dds.com` / `Usuario123!` con rol `usuario`.
- `bruno@dds.com` / `Usuario123!` con rol `usuario`.

Estas credenciales existen solo para desarrollo local dentro del realm de prueba. El backend no almacena contrasenas ni valida login.

## Autenticacion y autorizacion

El login y el registro reales se realizan en Keycloak. El backend no genera JWT propios, no guarda contrasenas y no implementa login manual.

Flujo:

1. El usuario entra al frontend.
2. `keycloak-js` redirige a Keycloak para login o registro.
3. Keycloak emite un access token JWT.
4. Axios agrega `Authorization: Bearer <token>` en cada llamada protegida.
5. El backend valida firma, expiracion e issuer usando JWKS del realm.
6. El backend lee roles desde `realm_access.roles` o `resource_access[clientId].roles`.
7. El backend sincroniza un perfil minimo en la tabla `usuarios` para poder relacionar reservas e historial.

Rutas `POST /api/auth/register` y `POST /api/auth/login`:

- Permanecen por compatibilidad con el enunciado.
- Responden informacion del proveedor Keycloak.
- No reciben ni validan credenciales locales.
- No devuelven JWT propio.

Ejemplo:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "message": "La operacion de inicio de sesion se realiza desde Keycloak",
  "authProvider": "keycloak",
  "keycloak": {
    "url": "http://localhost:8080",
    "realm": "reservas-aulas",
    "clientId": "reservas-frontend"
  }
}
```

## Persistencia con Sequelize y SQLite

La conexion esta en:

- `backend/src/database/sequelize.js`

Inicializacion, migracion simple y carga semilla:

- `backend/src/data/database.js`
- `backend/src/database/migrate.js`
- `backend/src/database/seed.js`
- `backend/src/database/reset.js`

Scripts:

```bash
npm run db:migrate
npm run db:seed
npm run db:reset
```

Modelos:

- `backend/src/models/Usuario.js`
- `backend/src/models/Aula.js`
- `backend/src/models/Reserva.js`
- `backend/src/models/HistorialReserva.js`
- `backend/src/models/index.js`

Asociaciones:

- `Usuario hasMany Reserva`
- `Reserva belongsTo Usuario`
- `Aula hasMany Reserva`
- `Reserva belongsTo Aula`
- `Reserva hasMany HistorialReserva`
- `HistorialReserva belongsTo Reserva`
- `Usuario hasMany HistorialReserva`
- `HistorialReserva belongsTo Usuario`

Entidades principales:

- Usuario: `id`, `keycloakId`, `nombre`, `email`, `rol`, `activo`.
- Aula: `id`, `nombre`, `ubicacion`, `capacidad`, `recursos`, `activa`.
- Reserva: `id`, `aulaId`, `usuarioId`, `fecha`, `horaInicio`, `horaFin`, `cantidadPersonas`, `motivo`, `estado`.
- HistorialReserva: `id`, `reservaId`, `usuarioId`, `accion`, `fechaHora`, `valorAnterior`, `valorNuevo`.

## Reglas de negocio de reservas

Implementadas en `backend/src/services/reservas.service.js`.

Validaciones:

- El aula debe existir.
- El aula debe estar activa.
- La cantidad de personas no puede superar la capacidad del aula.
- `horaInicio` debe ser menor que `horaFin`.
- El horario debe estar dentro de `HORARIO_INICIO` y `HORARIO_FIN`.
- No puede existir superposicion con otra reserva `pendiente` o `aprobada` del mismo aula y fecha.
- Usuarios comunes solo pueden ver y gestionar reservas propias.
- Administradores pueden supervisar y administrar el sistema completo.

Estados permitidos:

- `pendiente -> aprobada`
- `pendiente -> rechazada`
- `pendiente -> cancelada`
- `aprobada -> cancelada`

Estados finales:

- `rechazada`
- `cancelada`

Acciones auditadas automaticamente:

- creacion
- edicion
- aprobacion
- rechazo
- cancelacion

## Endpoints REST

Todas las respuestas de error usan JSON:

```json
{ "error": "El aula no tiene capacidad suficiente" }
```

### Health

`GET /api/health`

Respuesta `200`:

```json
{ "ok": true }
```

### Aulas

`GET /api/aulas`

Respuesta `200`:

```json
[
  {
    "id": "aula-910",
    "nombre": "910",
    "ubicacion": "Edificio Possetto - Piso 1",
    "capacidad": 45,
    "recursos": ["proyector", "parlantes"],
    "activa": true
  }
]
```

### Reservas

`GET /api/reservas?fecha=&estado=&aulaId=&q=&page=&limit=&sortBy=&order=`

Headers:

```http
Authorization: Bearer <access_token_keycloak>
```

Respuesta `200`:

```json
{
  "data": [
    {
      "id": "res-1001",
      "aulaId": "aula-910",
      "usuarioId": "usr-001",
      "fecha": "2026-06-18",
      "horaInicio": "09:00",
      "horaFin": "11:00",
      "cantidadPersonas": 35,
      "motivo": "Clase de consulta de DDS",
      "estado": "pendiente",
      "aula": { "id": "aula-910", "nombre": "910" },
      "usuario": { "id": "usr-001", "email": "ana@dds.com", "rol": "usuario" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  }
}
```

`GET /api/reservas/resumen`

- Requiere rol `admin`.
- Devuelve reservas por estado, ocupacion por aula y proximas reservas.

`GET /api/reservas/:id`

- Admin ve cualquier reserva.
- Usuario comun ve solo reservas propias.

`GET /api/reservas/:id/historial`

- Devuelve historial completo de la reserva.

`POST /api/reservas`

```json
{
  "aulaId": "aula-101",
  "fecha": "2026-07-01",
  "horaInicio": "10:00",
  "horaFin": "12:00",
  "cantidadPersonas": 20,
  "motivo": "Clase de repaso"
}
```

Respuesta `201`: reserva creada en estado `pendiente`.

`PUT /api/reservas/:id`

Permite editar datos de reserva segun permisos y estado.

`PATCH /api/reservas/:id/cancelar`

- Admin puede cancelar cualquier reserva.
- Usuario comun puede cancelar reservas propias.

`PATCH /api/reservas/:id/aprobar`

- Requiere rol `admin`.

`PATCH /api/reservas/:id/rechazar`

- Requiere rol `admin`.

Codigos usados:

- `200`: lectura, compatibilidad auth, actualizacion correcta.
- `201`: creacion de reserva.
- `400`: validacion o regla de negocio incumplida.
- `401`: token ausente, invalido o vencido.
- `403`: rol insuficiente o recurso ajeno.
- `404`: ruta o recurso inexistente.
- `500`: error interno no controlado.

## Frontend

Rutas:

- `/login`: inicia sesion con Keycloak.
- `/registro`: registra usuario en Keycloak si el realm lo permite.
- `/reservas`: listado con filtros por fecha, estado, aula y busqueda.
- `/reservas/nueva`: creacion de reserva.
- `/reservas/:id`: detalle e historial.
- `/reservas/:id/editar`: edicion.
- `/admin/resumen`: panel administrativo protegido por rol `admin`.
- `*`: pagina no encontrada.

Componentes y capas relevantes:

- `frontend/src/auth/keycloak.js`: configuracion de Keycloak, renovacion de token y lectura de roles.
- `frontend/src/context/AuthContext.jsx`: estado global de sesion.
- `frontend/src/api/apiClient.js`: instancia Axios con baseURL, token Bearer y errores normalizados.
- `frontend/src/services/*.js`: servicios por recurso.
- `frontend/src/components/ProtectedRoute.jsx`: rutas protegidas por autenticacion y rol.
- `frontend/src/components/ReservaActions.jsx` y `frontend/src/pages/ReservaDetailPage.jsx`: visibilidad de acciones segun rol y propiedad de la reserva. La propiedad se resuelve contra `usuarioId`, `usuario.keycloakId` o `usuario.email` para compatibilizar el `sub` de Keycloak con el id interno de Sequelize.
- `frontend/src/pages/*.jsx`: pantallas transaccionales, detalle, listado, login, registro, resumen y 404.

La interfaz contempla estados de carga, error y ausencia de resultados en las operaciones principales.

## Testing

Backend:

```bash
cd backend
npm test
```

Las pruebas usan Jest y Supertest. Para no depender de un Keycloak externo durante CI/local, se activa `AUTH_PROVIDER=local-test` dentro del test. Este modo solo valida tokens HS256 creados por la prueba contra usuarios semilla de dominio. No existe login local ni contrasenas persistidas.

Cobertura funcional incluida:

- Endpoint de auth delegado a Keycloak.
- Listado de reservas con paginacion.
- Filtro por estado.
- Detalle existente e inexistente.
- Creacion valida y registro de historial.
- Capacidad insuficiente.
- Superposicion horaria.
- Acceso sin JWT.
- Rol insuficiente.
- Edicion con conflicto.
- Transicion de estado no permitida.

Frontend:

```bash
cd frontend
npm run build
```

## Pruebas con Postman

1. Levantar Keycloak, backend y frontend.
2. Obtener un token desde Keycloak usando Authorization Code Flow desde el frontend, o usar la pestaña Authorization de Postman con OAuth 2.0.
3. Configurar:

```text
Auth URL: http://localhost:8080/realms/reservas-aulas/protocol/openid-connect/auth
Access Token URL: http://localhost:8080/realms/reservas-aulas/protocol/openid-connect/token
Client ID: reservas-frontend
Scope: openid profile email
Callback URL: el callback configurado en Postman
```

4. En cada request protegida agregar:

```http
Authorization: Bearer <access_token>
```

Ejemplo para crear reserva:

```http
POST http://localhost:3001/api/reservas
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "aulaId": "aula-101",
  "fecha": "2026-07-01",
  "horaInicio": "10:00",
  "horaFin": "12:00",
  "cantidadPersonas": 20,
  "motivo": "Clase de repaso"
}
```

## Estructura de carpetas

```text
backend/
  src/
    app.js
    server.js
    config/
      config.js
    controllers/
      auth.controller.js
      aulas.controller.js
      reservas.controller.js
    data/
      database.js
      seedData.js
    database/
      sequelize.js
      migrate.js
      seed.js
      reset.js
    middlewares/
      auth.middleware.js
      error.middleware.js
      role.middleware.js
      validate.middleware.js
    models/
      Aula.js
      HistorialReserva.js
      Reserva.js
      Usuario.js
      index.js
    routes/
      auth.routes.js
      aulas.routes.js
      reservas.routes.js
    services/
      auth.service.js
      aulas.service.js
      reservas.service.js
    utils/
    validations/
  tests/
    reservas.test.js
frontend/
  public/
  src/
    api/
    auth/
    components/
    context/
    pages/
    services/
keycloak/
  realm-export.json
docker-compose.yml
```

## Analisis de impacto de los cambios

- Migracion ES Modules: afecta a todos los archivos backend que usaban `require` y `module.exports`, mas `package.json` de backend y frontend. Se agregaron extensiones `.js` en imports internos.
- Persistencia: reemplaza JSON por SQLite/Sequelize. Impacta servicios de aulas, reservas, auth middleware, tests y scripts de inicializacion.
- Autenticacion: elimina login local como mecanismo real. Impacta `auth.service`, `auth.controller`, `auth.routes` y `auth.middleware`.
- Reservas: mantiene contrato de endpoints, pero ahora la lectura/escritura es asincrona y transaccional.
- Testing: deja de depender de credenciales locales y usa tokens de prueba controlados.
- Frontend: se mantiene la arquitectura existente, se formaliza ES Modules desde `package.json` y se corrige la comparacion de propiedad de reservas para que los usuarios comunes puedan editar o cancelar sus propias reservas cuando correspondan.

## Resolucion de problemas

Keycloak no importa el realm:

- Verificar que `keycloak/realm-export.json` exista.
- Reiniciar el contenedor con `docker compose down` y luego `docker compose up -d keycloak`.

El backend responde `JWT invalido o vencido`:

- Revisar que `KEYCLOAK_URL`, `KEYCLOAK_REALM` y `KEYCLOAK_CLIENT_ID` coincidan con el realm.
- Confirmar que el token sea un access token vigente.

El frontend queda sin sesion:

- Verificar que Keycloak este en `http://localhost:8080`.
- Confirmar redirect URI `http://localhost:5173/*`.

Error de SQLite:

- Ejecutar `npm run db:reset` dentro de `backend`.
- Verificar permisos de escritura en `backend/data`.

Vulnerabilidades npm:

- `npm install` puede reportar vulnerabilidades transitivas. No se aplica `npm audit fix --force` automaticamente porque podria introducir cambios mayores de versiones y romper compatibilidad.
