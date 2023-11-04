const sequelize = require('./db-sql');
const mongoose = require('./db-nosql');

const User = require('../models/sql/user');
const Lockout = require('../models/sql/lockout');

const Token = require('../models/sql/token');

const Product = require('../models/sql/product');
const Category = require('../models/sql/category');

const Order = require('../models/sql/order');
const DetailsOrder = require('../models/sql/detailsOrder');

const Size = require('../models/sql/size');
const Color = require('../models/sql/color');
const Stock = require('../models/sql/stock');

Token.belongsTo(User);

// Stock relations
Stock.belongsTo(Product, {
  foreignKey: 'product_id',
});
Stock.belongsTo(Size, {
  foreignKey: 'size_id',
});
Stock.belongsTo(Color, {
  foreignKey: 'color_id',
});

// Order relation
Order.belongsTo(User, {
  foreignKey: 'user_id',
});

Order.hasMany(DetailsOrder, { foreignKey: 'order_id' });

// detailsOrder relations
DetailsOrder.belongsTo(Product, {
  foreignKey: 'product_id',
});
DetailsOrder.belongsTo(Order, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
});

//sequelize.sync({ force: true });
