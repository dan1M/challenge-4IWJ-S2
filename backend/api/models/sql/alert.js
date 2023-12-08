const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = require('./db-sql');

const Alert = sequelize.define(
  'alert',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    alert_type_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    hooks: {
      beforeValidate: (alert, options) => {
        console.log('Before Create Hook');
        alert.id = uuidv4();
        console.log('Generated ID:', alert.id);
      },
    },
  },
);

module.exports = Alert;
