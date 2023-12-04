const { validationResult } = require('express-validator/check');
const Stock = require('../models/sql/stock.js');
const {
  updateOrCreateMongoProduct,
} = require('../util/updateOrCreateMongoProduct');

exports.findAll = async (req, res, next) => {
  try {
    const stocks = await Stock.findAll();
    res.status(200).json(stocks);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  const stockId = req.params.stockId;
  try {
    const stock = await Stock.findByPk(stockId);
    if (!stock) {
      const error = new Error('Could not find stock.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(stock);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findStocksByProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const stocks = await Stock.findAll({
      where: { product_id: productId },
    });

    if (!stocks || stocks.length === 0) {
      const error = new Error('Could not find stocks for this product.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(stocks);
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

    const quantity = req.body.quantity;
    const product = req.body.product;
    const size = req.body.size;
    const color = req.body.color;

    const stock = await Stock.create({
      quantity: quantity,
      product_id: product,
      size_id: size,
      color_id: color,
    });

    await updateOrCreateMongoProduct(product);

    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const stockId = req.params.stockId;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const [nbUpdated, stocks] = await Stock.update(req.body, {
      where: {
        id: stockId,
      },
      returning: true,
      individualHooks: true,
    });
    if (stocks[0]) {
      await updateOrCreateMongoProduct(stocks[0].product_id);

      res.status(200).json(stocks[0]);
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
  const stockId = req.params.stockId;
  try {
    const stock = await Stock.findByPk(stockId);
    if (!stock) {
      const error = new Error('Could not find stock.');
      error.statusCode = 404;
      throw error;
    }
    await stock.destroy();
    await updateOrCreateMongoProduct(stock.product_id);

    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
