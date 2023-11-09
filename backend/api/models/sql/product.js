const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

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
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Product;
