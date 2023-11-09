const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const Product = sequelize.define(
  'product',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    hooks: {
      beforeValidate: (product, options) => {
        console.log('Before Create Hook');
        product.id = uuidv4();
        console.log('Generated ID:', product.id);
      },
    },
  },
);

module.exports = Product;
