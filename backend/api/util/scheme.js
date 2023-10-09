const sequelize = require('./db-sql');
const mongoose = require('./db-nosql');

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');

const Order = require('../models/order');
const DetailsOrder = require('../models/detailsOrder');

// Pour mettre à jour la structure des tables (supprime les données)
// sequelize.sync({ force: true });
