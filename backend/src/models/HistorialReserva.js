import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const HistorialReserva = sequelize.define(
  "HistorialReserva",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    reservaId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accion: {
      type: DataTypes.ENUM("creacion", "edicion", "aprobacion", "rechazo", "cancelacion"),
      allowNull: false
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    valorAnterior: {
      type: DataTypes.JSON,
      allowNull: true
    },
    valorNuevo: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: "historial_reservas",
    timestamps: true
  }
);

export default HistorialReserva;
