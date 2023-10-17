const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Stock = sequelize.define('stock', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Stock;
