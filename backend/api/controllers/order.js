const sequelize = require('sequelize');
const { validationResult } = require('express-validator/check');
const Order = require('../models/sql/order.js');
const DetailsOrder = require('../models/sql/detailsOrder');
const Product = require('../models/sql/product');

//const OrderMongo = require('../models/nosql/product.js');

exports.findAll = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [DetailsOrder],
    });
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
    const order = await Order.findByPk(orderId, { include: [DetailsOrder]});
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(order );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findUserOrders = async (req, res, next) => {
  const userId = req.params.userId; 
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [DetailsOrder]
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

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = req.body.user;
    const status = 'Pending';
    const details = req.body.details;

    const order = await Order.create({
      status: status,
      user_id: user,
    });

    // Créez les détails de commande associés à cette commande
    for (const detail of details) {
      const product = await Product.findByPk(detail.product);
      if (product) {
        const price_at_ordering = product.price;
        await DetailsOrder.create({
          order_id: order.id,
          product_id: detail.product,
          quantity: detail.quantity,
          price: price_at_ordering,
        });
      }
    }

    /*await ProductMongo.create({
      title: title,
      description: description,
      price: price,
    });*/

    res.status(201).json({ message: 'Order created!', order: order });
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
    const order = await Order.findByPk(orderId);
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }
    await order.destroy();
    //await ProductMongo.deleteOne({ title: product.title });
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
