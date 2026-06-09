import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    keycloakId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    rol: {
      type: DataTypes.ENUM("admin", "usuario"),
      allowNull: false,
      defaultValue: "usuario"
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "usuarios",
    timestamps: true
  }
);

export default Usuario;
