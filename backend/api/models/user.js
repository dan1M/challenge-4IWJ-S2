const { DataTypes } = require('sequelize');

const sequelize = require('../util/db-sql');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: DataTypes.STRING,
  password: DataTypes.STRING,
  verifyEmail: DataTypes.BOOLEAN,
});

module.exports = User;
