require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const scheme = require('./util/scheme');
const mailer = require('./util/mailer');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const colorRoutes = require('./routes/color');
const sizeRoutes = require('./routes/size');
const stockRoutes = require('./routes/stock');

const port = process.env.PORT;

const app = express();

app.listen(port, () => {
  console.log(`Challenge S2 app listening on port ${port}`);
});

app.use(bodyParser.json()); // application/json
app.use(cookieParser(process.env.JWT_SECRET));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/brands', brandRoutes);
app.use('/categories', categoryRoutes);
app.use('/colors', colorRoutes);
app.use('/sizes', sizeRoutes);
app.use('/stocks', stockRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, invalid_data: data });
});
