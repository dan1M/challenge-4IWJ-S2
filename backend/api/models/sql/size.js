const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = require('./db-sql');

const Size = sequelize.define(
  'size',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    hooks: {
      beforeValidate: (size, options) => {
        console.log('Before Create Hook');
        size.id = uuidv4();
        console.log('Generated ID:', size.id);
      },
    },
  },
);

module.exports = Size;
