const { Sequelize } = require("sequelize");
const sequelize = require("../db");
// sequelize.sync({ alter: true });
const Auth = sequelize.define(
  "auth",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
// Auth.sync({ force: true });
module.exports = Auth;
