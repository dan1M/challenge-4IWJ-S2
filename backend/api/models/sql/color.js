const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Color = sequelize.define(
  'color',
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
      beforeValidate: (color, options) => {
        console.log('Before Create Hook');
        color.id = uuidv4();
        console.log('Generated ID:', color.id);
      },
    },
  },
);

module.exports = Color;
