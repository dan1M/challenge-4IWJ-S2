const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const DetailsOrder = sequelize.define('detailsOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
  price: DataTypes.DOUBLE,
});

module.exports = DetailsOrder;
