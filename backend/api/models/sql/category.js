const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.UUIDV4,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = Category;
