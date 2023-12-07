require('dotenv').config();
require('./models/nosql/db-nosql');
const path = require('node:path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const mailer = require('./util/mailer');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/products');
const categoryRoutes = require('./routes/category');
const colorRoutes = require('./routes/color');
const sizeRoutes = require('./routes/size');
const stockRoutes = require('./routes/stock');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const deliveryRoutes = require('./routes/delivery');
const paymentRoutes = require('./routes/payment');
const cronDeleteExpiredCart = require('./crons/deleteExpiredCarts');
const alertTypeRoutes = require('./routes/alert-type');
const alertsRoutes = require('./routes/alerts');
const port = process.env.PORT;

const app = express();

app.listen(port || 3000, () => {
  console.log(`Challenge S2 app listening on port ${port}`);
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.urlencoded({ extended: true, limit: '16mb' })); // Adjust the limit as needed
app.use(express.json()); // application/json
const corsOptions = {
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
  credentials: true,
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
);
app.use(cors(corsOptions));

app.use(cookieParser(process.env.JWT_SECRET));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoryRoutes);
app.use('/colors', colorRoutes);
app.use('/sizes', sizeRoutes);
app.use('/stocks', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/payment', paymentRoutes);
app.use('/alert-type', alertTypeRoutes);
app.use('/alerts', alertsRoutes);

cronDeleteExpiredCart();
app.use('/alert-type', alertTypeRoutes);
app.use('/alerts', alertsRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, invalid_data: data });
});
