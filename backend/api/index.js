const express = require('express');
const bodyParser = require('body-parser');

const scheme = require('./util/scheme');

const app = express();

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

