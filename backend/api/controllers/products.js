const { validationResult } = require('express-validator/check');
const Product = require('../models/sql/product.js');
const ProductMongo = require('../models/nosql/product.js');
const Stock = require('../models/sql/stock.js');
const Category = require('../models/sql/category');
const Size = require('../models/sql/size.js');
const Color = require('../models/sql/color.js');
const {
  updateOrCreateMongoProduct,
} = require('../util/updateOrCreateMongoProduct');

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
      category_id: category,
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
    await updateOrCreateMongoProduct(product.id);

    res.sendStatus(201);
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

    const [nbUpdated, products] = await Product.update(req.body, {
      where: {
        id: productId,
      },
      returning: true,
    });


    if (products[0]) {
      await updateOrCreateMongoProduct(productId);

      res.status(200).json(products[0]);
    } else {
      res.sendStatus(404);
    }
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
