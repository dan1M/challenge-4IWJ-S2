const express = require('express');
const { body } = require('express-validator/check');

const orderController = require('../controllers/order');

const Product = require('../models/sql/product');

const router = express.Router();

router.get('/', orderController.findAll);

router.get('/:orderId', orderController.findOne);
router.get('/user/:userId', orderController.findUserOrders);

router.post(
  '/',
  [
    body('user').isInt(),
    body('details').isArray(),
    body('details.*.product')
      .isInt()
      .custom(async value => {
        const existingProduct = await Product.findByPk(value);
        if (!existingProduct) {
          throw new Error('Could not find product.');
        }
      }),
    body('details.*.quantity').isInt({ gt: 0 }),
  ],
  orderController.create,
);

router.delete('/:orderId', orderController.delete);

module.exports = router;
