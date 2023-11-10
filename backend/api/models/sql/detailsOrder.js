const { DataTypes } = require('sequelize');

const sequelize = require('./db-sql');

const DetailsOrder = sequelize.define(
  'detailsOrder',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
  },
  {
    hooks: {
      beforeValidate: (detailsOrder, options) => {
        console.log('Before Create Hook');
        detailsOrder.id = uuidv4();
        console.log('Generated ID:', detailsOrder.id);
      },
    },
  },
);

module.exports = DetailsOrder;
