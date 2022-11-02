const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const Register = sequelize.define(
  "register",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profile: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isAdmin:{
      type: Sequelize.BOOLEAN,
      defaultValue:0
    }, createdAt: {
      type: Sequelize.DATE,
      defaultValue: () => new Date(),
    }

  },
  {
    freezeTableName: true,
  }
);
// Register.sync({ alter: true });
module.exports = Register;
