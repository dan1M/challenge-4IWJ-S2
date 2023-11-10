const { v4: uuidv4 } = require('uuid');

const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Lockout = sequelize.define(
  'lockout',
  {
    id: {
      type: DataTypes.UUID,
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
  },
  {
    hooks: {
      beforeValidate: (lockout, options) => {
        console.log('Before Create Hook');
        lockout.id = uuidv4();
        console.log('Generated ID:', lockout.id);
      },
    },
  },
);

module.exports = Lockout;
