const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const deliveryController = require('../controllers/delivery');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

router.get('/shipping_methods', isAuth, deliveryController.shippingMethods);

module.exports = router;
