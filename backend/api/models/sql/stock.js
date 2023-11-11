const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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
    product_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    color_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    size_id:{
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
    },
  },
  {
    indexes: [
        {
            unique: true,
            fields: ['product_id', 'size_id', 'color_id']
        }
    ]
  }
);
  


module.exports = Stock;
