import Usuario from "./Usuario.js";
import Aula from "./Aula.js";
import Reserva from "./Reserva.js";
import HistorialReserva from "./HistorialReserva.js";

Usuario.hasMany(Reserva, { foreignKey: "usuarioId", as: "reservas" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

Aula.hasMany(Reserva, { foreignKey: "aulaId", as: "reservas" });
Reserva.belongsTo(Aula, { foreignKey: "aulaId", as: "aula" });

Reserva.hasMany(HistorialReserva, { foreignKey: "reservaId", as: "historial" });
HistorialReserva.belongsTo(Reserva, { foreignKey: "reservaId", as: "reserva" });

Usuario.hasMany(HistorialReserva, { foreignKey: "usuarioId", as: "accionesHistorial" });
HistorialReserva.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

export { Aula, HistorialReserva, Reserva, Usuario };
