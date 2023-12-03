const { validationResult } = require('express-validator/check');
const Category = require('../models/sql/category');
const CategoryMongo = require('../models/nosql/category');

exports.findAll = async (req, res, next) => {
  try {
    const categories = await CategoryMongo.find();
    res.status(200).json(categories);
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
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }
    const name = req.body.name;
    const category = await Category.create({
      name: name,
    });

    const categoryMongo = await CategoryMongo.create({
      _id: category.id,
      name: name,
    });

    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await CategoryMongo.findById(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    await category.destroy();
    await CategoryMongo.deleteOne({ name: category.name });

    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }
    const [nbUpdated, categories] = await Category.update(req.body, {
      where: {
        id: categoryId,
      },
      returning: true,
    });
    const categoryMongo = await CategoryMongo.updateOne(req.body);

    if (categories[0]) {
      res.status(200).json(categories[0]);
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
