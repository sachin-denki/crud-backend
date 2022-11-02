const { Sequelize } = require("sequelize");
const sequelize = require("../db");

const AddCart = sequelize.define(
  "addcart",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
// AddCart.sync({ alter: true });
module.exports = AddCart;
