// La autenticacion se delega en Keycloak; estos usuarios solo representan perfiles de dominio.
const seedData = {
  usuarios: [
    {
      id: "usr-admin",
      keycloakId: "kc-admin",
      nombre: "Admin DDS",
      email: "admin@dds.com",
      rol: "admin",
      activo: true
    },
    {
      id: "usr-001",
      keycloakId: "kc-ana",
      nombre: "Ana Perez",
      email: "ana@dds.com",
      rol: "usuario",
      activo: true
    },
    {
      id: "usr-002",
      keycloakId: "kc-bruno",
      nombre: "Bruno Gomez",
      email: "bruno@dds.com",
      rol: "usuario",
      activo: true
    }
  ],
  aulas: [
    {
      id: "aula-910",
      nombre: "910",
      ubicacion: "Edificio Possetto - Piso 1",
      capacidad: 45,
      recursos: ["proyector", "parlantes"],
      activa: true
    },
    {
      id: "aula-a4",
      nombre: "A4",
      ubicacion: "Edificio Central - Planta baja",
      capacidad: 80,
      recursos: ["proyector", "pizarra"],
      activa: true
    },
    {
      id: "lab-a6",
      nombre: "Laboratorio A6",
      ubicacion: "Edificio Laboratorios - Piso 2",
      capacidad: 35,
      recursos: ["laboratorio", "pcs", "proyector"],
      activa: true
    },
    {
      id: "aula-101",
      nombre: "101",
      ubicacion: "Edificio Central - Piso 1",
      capacidad: 30,
      recursos: ["pizarra"],
      activa: true
    },
    {
      id: "aula-magna",
      nombre: "Aula Magna",
      ubicacion: "Edificio Principal",
      capacidad: 150,
      recursos: ["proyector", "sonido", "escenario"],
      activa: false
    }
  ],
  reservas: [
    {
      id: "res-1001",
      aulaId: "aula-910",
      usuarioId: "usr-001",
      fecha: "2026-06-18",
      horaInicio: "09:00",
      horaFin: "11:00",
      cantidadPersonas: 35,
      motivo: "Clase de consulta de DDS",
      estado: "pendiente",
      createdAt: "2026-06-08T10:30:00.000Z"
    },
    {
      id: "res-1002",
      aulaId: "aula-a4",
      usuarioId: "usr-002",
      fecha: "2026-06-18",
      horaInicio: "11:00",
      horaFin: "13:00",
      cantidadPersonas: 70,
      motivo: "Parcial de Programación",
      estado: "aprobada",
      createdAt: "2026-06-08T11:00:00.000Z"
    },
    {
      id: "res-1003",
      aulaId: "lab-a6",
      usuarioId: "usr-001",
      fecha: "2026-06-19",
      horaInicio: "14:00",
      horaFin: "16:00",
      cantidadPersonas: 28,
      motivo: "Práctica de laboratorio",
      estado: "rechazada",
      createdAt: "2026-06-09T09:00:00.000Z"
    },
    {
      id: "res-1004",
      aulaId: "aula-101",
      usuarioId: "usr-002",
      fecha: "2026-06-20",
      horaInicio: "08:00",
      horaFin: "10:00",
      cantidadPersonas: 25,
      motivo: "Reunión de catedra",
      estado: "cancelada",
      createdAt: "2026-06-09T10:00:00.000Z"
    },
    {
      id: "res-1005",
      aulaId: "aula-910",
      usuarioId: "usr-002",
      fecha: "2026-06-21",
      horaInicio: "16:00",
      horaFin: "18:00",
      cantidadPersonas: 40,
      motivo: "Seminario optativo",
      estado: "aprobada",
      createdAt: "2026-06-10T12:00:00.000Z"
    },
    {
      id: "res-1006",
      aulaId: "aula-a4",
      usuarioId: "usr-001",
      fecha: "2026-06-22",
      horaInicio: "18:00",
      horaFin: "20:00",
      cantidadPersonas: 50,
      motivo: "Taller integrador",
      estado: "pendiente",
      createdAt: "2026-06-10T13:00:00.000Z"
    },
    {
      id: "res-1007",
      aulaId: "lab-a6",
      usuarioId: "usr-002",
      fecha: "2026-06-23",
      horaInicio: "10:00",
      horaFin: "12:00",
      cantidadPersonas: 30,
      motivo: "Simulación de examen",
      estado: "aprobada",
      createdAt: "2026-06-11T08:00:00.000Z"
    },
    {
      id: "res-1008",
      aulaId: "aula-101",
      usuarioId: "usr-001",
      fecha: "2026-06-24",
      horaInicio: "13:00",
      horaFin: "15:00",
      cantidadPersonas: 20,
      motivo: "Consulta administrativa",
      estado: "pendiente",
      createdAt: "2026-06-11T09:00:00.000Z"
    },
    {
      id: "res-1009",
      aulaId: "aula-910",
      usuarioId: "usr-001",
      fecha: "2026-06-25",
      horaInicio: "20:00",
      horaFin: "22:00",
      cantidadPersonas: 42,
      motivo: "Clase especial nocturna",
      estado: "aprobada",
      createdAt: "2026-06-12T10:00:00.000Z"
    },
    {
      id: "res-1010",
      aulaId: "aula-a4",
      usuarioId: "usr-002",
      fecha: "2026-06-26",
      horaInicio: "09:00",
      horaFin: "10:30",
      cantidadPersonas: 60,
      motivo: "Presentación final",
      estado: "rechazada",
      createdAt: "2026-06-12T11:00:00.000Z"
    }
  ],
  historial_reservas: [
    {
      id: "hist-001",
      reservaId: "res-1001",
      usuarioId: "usr-001",
      accion: "creacion",
      fechaHora: "2026-06-08T10:30:00.000Z",
      valorAnterior: null,
      valorNuevo: { estado: "pendiente" }
    }
  ]
};

export default seedData;
