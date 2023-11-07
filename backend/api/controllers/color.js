const { validationResult } = require('express-validator/check');
const Color = require('../models/sql/color');
const ColorMongo = require('../models/nosql/color');
const { modelNames } = require('mongoose');

exports.getAll = async (req, res, next) => {
  try {
    const colors = await Color.findAll();
    res.status(200).json(colors);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
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
    const color = await Color.create({
      name: name,
    });

    await ColorMongo.create({
      name: name,
    });

    await res.status(201).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Exemple GET par ID (CRUD)
exports.findOne = async (req, res, next) => {
  // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
  const colorId = req.params.colorId;
  // Utilisez 'findById' de mongoose
  try {
    const color = await Color.findByPk(colorId);
    if (!color) {
      const error = new Error('Could not find color.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(color);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.delete = async (req, res, next) => {
  const colorId = req.params.colorId;
  try {
    const color = await Color.findByPk(colorId);
    if (!color) {
      const error = new Error('Could not find color.');
      error.statusCode = 404;
      throw error;
    }
    await color.destroy();
    //await ColorMongo.deleteOne({ name: color.name });

    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const colorId = req.params.colorId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;

  try {
    const color = await Color.findByPk(colorId);
    if (!color) {
      const error = new Error('Could not find color.');
      error.statusCode = 404;
      throw error;
    }

    await color.update({ name: name });
    await ColorMongo.updateOne({ name: name });

    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
