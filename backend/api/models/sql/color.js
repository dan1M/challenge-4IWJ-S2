const { DataTypes } = require('sequelize');

const sequelize = require('../../util/db-sql');

const Color = sequelize.define('color', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = Color;
