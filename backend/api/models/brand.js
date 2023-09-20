const { DataTypes } = require("sequelize");

const sequelize = require("../util/db-sql");

const Brand = sequelize.define("brand", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = Brand;
