const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {
  alertPriceChange,
  alertProductStock,
} = require('../../util/createAlert');

const sequelize = require('./db-sql');

const Stock = sequelize.define(
  'stock',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    color_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    size_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (stock, options) => {
        console.log('Before Create Hook');
        stock.id = uuidv4();
        console.log('Generated ID:', stock.id);
      },
      beforeUpdate: async (stock, options) => {
        console.log('Before Create Hook');
        stock.id = uuidv4();
        console.log('Generated ID:', stock.id);
        const oldStock = await Stock.findByPk(stock.id);
        if (oldStock.price !== stock.price) {
          alertPriceChange(stock.product_id);
        }
        if (stock.quantity > oldStock.quantity) {
          alertProductStock(stock.product_id);
        }
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'size_id', 'color_id'],
      },
    ],
  },
);

module.exports = Stock;
