const { v4: uuidv4 } = require('uuid');

const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Token = sequelize.define(
  'token',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (token, options) => {
        console.log('Before Create Hook');
        token.id = uuidv4();
        console.log('Generated ID:', token.id);
      },
    },
  },
);

module.exports = Token;
