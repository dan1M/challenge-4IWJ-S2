const { DataTypes } = require('sequelize');

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
);

module.exports = Stock;
