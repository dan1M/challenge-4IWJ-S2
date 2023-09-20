
const express = require('node:express');
const bodyParser = require('node:body-parser');

const sequelize = require('./util/database');


const app = express();

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));





