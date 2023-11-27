const { validationResult } = require('express-validator/check');
const Cart = require('../models/nosql/cart');
const Stock = require('../models/sql/stock');
const Product = require('../models/sql/product');
const Color = require('../models/sql/color');
const Size = require('../models/sql/size');

exports.findOne = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      const error = new Error('Could not find cart informations.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(cart);
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
    const existingCart = await Cart.findOne({ user_id: req.user.id });
    if (existingCart) {
      const error = new Error('Cart already exists!');
      error.statusCode = 422;
      throw error;
    }

    const stock_id = req.body.stock_id;

    const stock = await Stock.findByPk(stock_id);
    if (!stock) {
      const error = new Error('Could not find stock.');
      error.statusCode = 404;
      throw error;
    }
    if (stock.quantity <= 0) {
      const error = new Error('Stock is empty.');
      error.statusCode = 404;
      throw error;
    }
    const product = await Product.findByPk(stock.product_id);
    const color = await Color.findByPk(stock.color_id);
    const size = await Size.findByPk(stock.size_id);

    const cart = await Cart.create({
      user_id: req.user.id,
      products: [
        {
          stock_id: stock_id,
          quantity: 1,
          price: stock.price,
          img: product.img,
          name: product.title,
          color: color.name,
          size: size.name,
        },
      ],
    });

    stock.quantity--;
    await stock.save();

    res.status(201).json(cart);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const stock_id = req.body.stock_id;
    const action = req.body.action;
    const cart_step = req.body.cart_step;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      const error = new Error('Could not find cart informations.');
      error.statusCode = 404;
      throw error;
    }

    if (stock_id && !action) {
      const error = new Error('Action is required.');
      error.statusCode = 422;
      throw error;
    }

    if (action && stock_id) {
      const stock = await Stock.findByPk(stock_id);
      if (!stock) {
        const error = new Error('Could not find stock.');
        error.statusCode = 404;
        throw error;
      }
      if (stock.quantity <= 0) {
        const error = new Error('Stock is empty.');
        error.statusCode = 404;
        throw error;
      }
      const productIndex = cart.products.findIndex(
        product => product.stock_id.toString() === stock_id.toString(),
      );
      switch (action) {
        case 'add':
          if (productIndex === -1) {
            const product = await Product.findByPk(stock.product_id);
            const color = await Color.findByPk(stock.color_id);
            const size = await Size.findByPk(stock.size_id);

            cart.products.push({
              stock_id: stock_id,
              quantity: 1,
              price: stock.price,
              img: product.img,
              name: product.title,
              color: color.name,
              size: size.name,
            });
          } else {
            cart.products[productIndex].quantity++;
          }
          stock.quantity--;
          break;
        case 'remove':
          cart.products[productIndex].quantity--;
          stock.quantity++;

          // Remove product from cart if quantity is 0
          if (cart.products[productIndex].quantity <= 0) {
            cart.products.splice(productIndex, 1);
          }
          break;
        case 'clear':
          stock.quantity += cart.products[productIndex].quantity;
          cart.products.splice(productIndex, 1);
          break;
      }
      await stock.save();
    }

    if (cart_step) {
      cart.cart_step = cart_step;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
