const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.UUIDV4,
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
