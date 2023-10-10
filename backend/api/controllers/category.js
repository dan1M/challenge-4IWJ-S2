const { validationResult } = require('express-validator/check');
const Category = require('../models/sql/category');
const e = require('express');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      message: 'Fetched categories successfully.',
      categories: categories,
    });
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

    res.status(201).json({ message: 'Category created!', id: category.id });
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
    const category = await Category.findByPk(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Category fetched.', category: category });
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
    await Category.destroy({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json({ message: 'Deleted category.', category: category });
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
    const category = await Category.findByPk(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    const name = req.body.name;
    const updatedCategory = await Category.update(
      { name: name },
      {
        where: {
          id: categoryId,
        },
      },
    );
    res
      .status(200)
      .json({ message: 'Category updated!', category: updatedCategory });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
