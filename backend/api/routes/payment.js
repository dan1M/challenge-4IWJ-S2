const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const paymentController = require('../controllers/payment');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

router.post(
  '/create-checkout-session',
  isAuth,
  paymentController.createCheckoutSession,
);
router.get('/session-status', isAuth, paymentController.getSessionStatus);

module.exports = router;
