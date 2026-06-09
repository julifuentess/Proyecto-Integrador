import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Reserva = sequelize.define(
  "Reserva",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    aulaId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    horaInicio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    horaFin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidadPersonas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aprobada", "rechazada", "cancelada"),
      allowNull: false,
      defaultValue: "pendiente"
    }
  },
  {
    tableName: "reservas",
    timestamps: true
  }
);

export default Reserva;
