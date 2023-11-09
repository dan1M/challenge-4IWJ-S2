const { validationResult } = require('express-validator/check');
const Product = require('../models/sql/product.js');
const ProductMongo = require('../models/nosql/product.js');
const Stock = require('../models/sql/stock.js');
const Category = require('../models/sql/category');
const Size = require('../models/sql/size.js');
const Color = require('../models/sql/color.js');
const { Types } = require('mongoose');

exports.findAll = async (req, res, next) => {
  try {
    const products = await ProductMongo.find();
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
    const category = req.body.category;

    const variantsBody = req.body.variants;

    const product = await Product.create({
      title: title,
      description: description,
      category: category,
    });

    //create variants for a product
    for (const variant of variantsBody) {
      for (const color of variant.colors) {
        const stock = await Stock.create({
          quantity: color.quantity,
          product_id: product.id,
          size_id: variant.size,
          color_id: color.color,
          price: color.price,
        });
      }
    }

    // insert product and variants in mongo
    const findCategory = await Category.findByPk(category);
    const productVariants = await Stock.findAll();
    const variants = [];

    for (const productVariant of productVariants) {
      const size = await Size.findByPk(productVariant.size_id);
      const color = await Color.findByPk(productVariant.color_id);
      variants.push({
        quantity: productVariant.quantity,
        price: productVariant.price,
        size: {
          id: size.id,
          name: size.name,
        },
        color: {
          id: color.id,
          name: color.name,
        },
      });
    }

    await ProductMongo.create({
      _id: new Types.ObjectId(product.id),
      title: title,
      description: description,
      category: findCategory.name,
      variants: variants,
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
