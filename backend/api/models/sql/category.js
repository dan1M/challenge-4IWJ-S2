const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const sequelize = require('./db-sql');

const Category = sequelize.define(
  'category',
  {
    id: {
      type: DataTypes.UUID,

      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    hooks: {
      beforeValidate: (category, options) => {
        console.log('Before Create Hook');
        category.id = uuidv4();
        console.log('Generated ID:', category.id);
      },
    },
  },
);

module.exports = Category;
