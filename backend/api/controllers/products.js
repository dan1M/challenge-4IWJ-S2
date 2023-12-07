const fs = require('node:fs');
// const path = require('node:path');

const path = require('node:path');
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
    const filter = {};
    const queryParameters = Object.keys(req.query);

    const searchText = req.query.searchText;
    if (searchText) {
      filter.$or = [
        { title: { $regex: new RegExp(searchText, 'i') } },
        { description: { $regex: new RegExp(searchText, 'i') } },
      ];
    }

    queryParameters.forEach(param => {
      switch (param) {
        case 'title':
          filter.title = { $regex: new RegExp(req.query.title, 'i') };
          break;
        case 'categories':
          filter['category.name'] = { $in: req.query.categories.split(',') };
          break;
        case 'sizes':
          filter['variants.size.name'] = { $in: req.query.sizes.split(',') };
          break;
        case 'colors':
          filter['variants.color.name'] = { $in: req.query.colors.split(',') };
          break;
        case 'brand':
          filter.brand = req.query.brand;
          break;
        case 'minPrice':
          filter['variants.price'] = filter['variants.price'] || {};
          filter['variants.price'].$gte = parseFloat(req.query.minPrice);
          break;
        case 'maxPrice':
          filter['variants.price'] = filter['variants.price'] || {};
          filter['variants.price'].$lte = parseFloat(req.query.maxPrice);
          break;
        case 'onSale':
          filter.onSale = true;
          break;
        case 'inStock':
          filter['variants.quantity'] = { $gt: 0 };
          break;
        default:
          break;
      }
    });

    const products = await ProductMongo.find(filter);
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
console.log(req.body, req.file, "req file");

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
    const imageUrl = req.file.path;

    const variantsBody = req.body.variants;

    const product = await Product.create({
      title: title,
      imageUrl: imageUrl,
      description: description,
      category_id: category,
    });

    //create variants for a product
    for (const variant of variantsBody) {
      const stock = await Stock.create({
        quantity: variant.quantity,
        product_id: product.id,
        size_id: variant.size,
        color_id: variant.color,
        price: variant.price,
      });

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
