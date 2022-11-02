const { Sequelize } = require("sequelize");
const sequelize = require("../db");

const ProductList = sequelize.define(
  "ProductList",
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
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brand: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    category:{
      type: Sequelize.TEXT,
      allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
// ProductList.sync({ force: true });
module.exports = ProductList;
