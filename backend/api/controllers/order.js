const { validationResult } = require('express-validator/check');
const Order = require('../models/nosql/order');
const Cart = require('../models/nosql/cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const deliveryController = require('../controllers/delivery');
const User = require('../models/sql/user');
const { send } = require('../util/mailer');

exports.findAll = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user_id: req.user.id,
    });

    if (!orders || orders.length === 0) {
      const error = new Error('Could not find orders for this user.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findOneUserOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({ _id: orderId, user_id: req.user.id });
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const sessionId = req.body.session_id;

    const user = await User.findByPk(req.user.id);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      session.status !== 'complete' ||
      session.customer_details.email !== user.email
    ) {
      const error = new Error('Invalid payment.');
      error.statusCode = 422;
      throw error;
    }

    const existingOrder = await Order.findOne({ payment_id: sessionId });
    if (existingOrder) {
      res.status(303).json(existingOrder);
      return;
    }

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      const error = new Error('Could not find cart informations.');
      error.statusCode = 404;
      throw error;
    }
    if (cart.cart_step < 3) {
      const error = new Error('Cart is not paid.');
      error.statusCode = 422;
      throw error;
    }
    // Next cart step
    cart.cart_step = 4;
    await cart.save();

    // Creating parcel with Sendcloud
    const deliveryData = await deliveryController.createPackage(req, res, next);

    // Creating order
    const order = await Order.create({
      user_id: req.user.id,
      products: cart.products,
      payment_id: sessionId,
      tracking_id: deliveryData.parcel.tracking_number,
      tracking_url: deliveryData.parcel.tracking_url,
      parcel_id: deliveryData.parcel.id,
      total: session.amount_total / 100,
    });

    // Deleting cart
    await cart.deleteOne({ _id: cart._id });

    // Sending email
    send(
      './assets/template/template-order-confirmation.ejs',
      {
        firstname: user.firstname,
        link: process.env.FRONT_URL + '/profile/my-orders/' + order._id,
        products: order.products,
        total: session.amount_total / 100,
      },
      user.email,
      `Confirmation de commande`,
    );

    res.status(201).json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }
    await order.deleteOne({ _id: orderId });
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
