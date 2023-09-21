const sequelize = require('./util/db-sql');
const mongoose = require('./util/db-nosql');

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');

const Order = require('../models/order');
const DetailsOrder = require('../models/detailsOrder');




sequelize.sync({ force: true });
