const { validationResult } = require('express-validator/check');
const Product = require('../models/sql/product.js');

exports.findAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      message: 'Fetched products successfully.',
      data: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Product fetched.', product: product });
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

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;

    const product = await Product.create({
      title: title,
      price: price,
      description: description,
      stock: stock,
    });
    res
      .status(201)
      .json({ message: 'Product created!', productId: product.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;

    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }
    await product.update({
      title: title,
      price: price,
      description: description,
      stock: stock,
    });

    res.status(200).json({ message: 'Product updated!', product: product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }
    await product.destroy();
    res.status(200).json({ message: 'Deleted product.', product: product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
