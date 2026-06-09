import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Aula = sequelize.define(
  "Aula",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    recursos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "aulas",
    timestamps: true
  }
);

export default Aula;
