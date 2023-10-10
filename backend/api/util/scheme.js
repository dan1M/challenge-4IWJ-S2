const sequelize = require('./db-sql');
const mongoose = require('./db-nosql');

const User = require('../models/sql/user');
const Product = require('../models/sql/product');
const Category = require('../models/sql/category');
const Brand = require('../models/sql/brand');

const Order = require('../models/sql/order');
const DetailsOrder = require('../models/sql/detailsOrder');

// Pour mettre à jour la structure des tables (supprime les données)
//sequelize.sync({ force: true });
