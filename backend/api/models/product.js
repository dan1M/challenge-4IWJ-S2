const { DataTypes } = require('sequelize');

const sequelize = require('../util/db-sql');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  stock: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Product;
