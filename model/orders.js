const { Sequelize } = require("sequelize");
const sequelize = require("../db");

const Order = sequelize.define(
  "orders",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    total: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    orderNumber:{
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: () => new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: () => new Date(),
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
// Order.sync({ force: true });
module.exports = Order;
