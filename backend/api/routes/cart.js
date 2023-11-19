const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const Cart = require('../models/nosql/cart');
const cartController = require('../controllers/cart');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, cartController.findOne);

router.post('/', isAuth, [body('stock_id').trim()], cartController.create);

router.patch(
  '/',
  isAuth,
  [
    body('stock_id').optional().trim(),
    body('action').optional().trim().isIn(['add', 'remove', 'clear']),
    body('cart_step').optional().trim().isNumeric(),
  ],
  cartController.update,
);

module.exports = router;
