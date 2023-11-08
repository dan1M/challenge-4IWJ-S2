const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Token;
