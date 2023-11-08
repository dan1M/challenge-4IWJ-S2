const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = Category;
