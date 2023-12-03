const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const orderController = require('../controllers/order');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

router.get('/', isAdmin, orderController.findAll);
router.get('/my-orders', isAuth, orderController.findUserOrders);

router.get('/:orderId', isAdmin, orderController.findOne);
router.get('/my-orders/:orderId', isAuth, orderController.findOneUserOrder);

router.post(
  '/',
  isAuth,
  [body('session_id').isString().trim()],
  orderController.create,
);

router.delete('/:orderId', isAdmin, orderController.delete);

module.exports = router;
