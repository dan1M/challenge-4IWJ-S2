const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

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
    defaultValue: 1,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
},
{
  indexes: [
      {
          unique: true,
          fields: ['product_id', 'size_id', 'color_id']
      }
  ]
});

module.exports = Stock;
