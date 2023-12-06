require('dotenv').config();

const sequelize = require('./models/sql/db-sql');
require('./models/nosql/db-nosql');

const User = require('./models/sql/user');
const Lockout = require('./models/sql/lockout');

const Token = require('./models/sql/token');

const Product = require('./models/sql/product');
const Category = require('./models/sql/category');

const Size = require('./models/sql/size');
const Color = require('./models/sql/color');
const Stock = require('./models/sql/stock');
const Alert = require('./models/sql/alert');
const AlertType = require('./models/sql/alert-type');

Token.belongsTo(User);

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Alert relations

Alert.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Alert.belongsTo(AlertType, {
  foreignKey: 'alert_type_id',
  onDelete: 'CASCADE',
});

Alert.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Stock relations
Stock.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
Stock.belongsTo(Size, {
  foreignKey: 'size_id',
  onDelete: 'CASCADE',
});
Stock.belongsTo(Color, {
  foreignKey: 'color_id',
  onDelete: 'CASCADE',
});

// Order relation
Order.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Order.hasMany(DetailsOrder, { foreignKey: 'order_id' });

// detailsOrder relations
DetailsOrder.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
DetailsOrder.belongsTo(Order, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
});

sequelize.sync({ alter: true });
