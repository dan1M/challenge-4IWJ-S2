const fs = require('node:fs');
const path = require('node:path');

const { validationResult } = require('express-validator/check');
const Product = require('../models/sql/product.js');
const ProductMongo = require('../models/nosql/product.js');

exports.findAll = async (req, res, next) => {
  try {
    const products = await ProductMongo.find({});
    res.status(200).json(products);
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
    const product = await ProductMongo.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(product);
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
    const imageUrl = req.file.path;
    const stock = req.body.stock;

    const product = await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      stock: stock,
    });

    const productMongo = await ProductMongo.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
    });

    res.status(201).json(productMongo);
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

    const productMongo = await ProductMongo.updateOne({
      title: title,
      description: description,
      price: price,
    });

    res.status(200).json(productMongo);
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
    clearImage(product.imageUrl);

    await product.destroy();
    await ProductMongo.deleteOne({ title: product.title });
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
