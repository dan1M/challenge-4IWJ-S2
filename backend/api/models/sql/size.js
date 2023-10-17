const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Size = sequelize.define('size', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = Size;
