const { validationResult } = require('express-validator/check');
const Order = require('../models/nosql/order');

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
    const order = await Order.find({ _id: orderId, user_id: req.user.id });
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

// * NEXT CART STEP
// * CREATION COLIS (SENDCLOUD)
// * CREATION COMMANDE A PARTIR DE PANIER
// * DELETE PANIER
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

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
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
