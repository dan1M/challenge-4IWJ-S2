const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Brand = sequelize.define('brand', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});

module.exports = Brand;
