const { validationResult } = require('express-validator/check');
const Product = require('../models/product.js');

exports.findAll = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.status(200).json({
        message: 'Fetched products successfully.',
        data: products,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.findOne = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Product fetched.', product: product });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.create = (req, res, next) => {
  const errors = validationResult(req);
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

  return Product.create({
    title: title,
    price: price,
    description: description,
    stock: stock,
  })
    .then(result => {
      res
        .status(201)
        .json({ message: 'Product created!', productId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  const productId = req.params.productId;
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

  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }

      return product.update({
        title: title ?? product.title,
        price: price ?? product.price,
        description: description,
        stock: stock,
      });
    })
    .then(result => {
      res.status(200).json({ message: 'Product updated!', product: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      return product.destroy();
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted product.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
