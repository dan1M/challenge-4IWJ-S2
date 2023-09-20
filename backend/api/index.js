
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/db-sql');
const mongoose = require('./util/db-nosql');

const User = require('./models/user');
const Order = require('./models/order')
const DetailsOrder = require('./models/detailsOrder')

const app = express();

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

sequelize.sync({force:true})
