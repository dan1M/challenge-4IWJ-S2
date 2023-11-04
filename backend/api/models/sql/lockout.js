const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Lockout = sequelize.define('lockout', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lastAttempt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Lockout;
