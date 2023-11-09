const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.UUIDV4,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = Product;
