const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = require('./db-sql');

const AlertType = sequelize.define(
  'alertType',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    type: DataTypes.STRING,
  },
  {
    hooks: {
      beforeValidate: (alertType, options) => {
        console.log('Before Create Hook');
        alertType.id = uuidv4();
        console.log('Generated ID:', alertType.id);
      },
    },
  },
);

module.exports = AlertType;
