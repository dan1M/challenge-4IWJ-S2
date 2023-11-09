const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.UUIDV4,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  status: DataTypes.STRING,
});

module.exports = Order;
