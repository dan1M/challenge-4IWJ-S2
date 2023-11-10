const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Order = sequelize.define(
  'order',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    status: DataTypes.STRING,
  },
  {
    hooks: {
      beforeValidate: (order, options) => {
        console.log('Before Create Hook');
        order.id = uuidv4();
        console.log('Generated ID:', order.id);
      },
    },
  },
);

module.exports = Order;
