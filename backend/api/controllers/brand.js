const { validationResult } = require('express-validator/check');
const Brand = require('../models/sql/brand');
const BrandMongo = require('../models/nosql/brand');
const { modelNames } = require('mongoose');

exports.findAll = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
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
    const brand = await Brand.create({
      name: name,
    });

    await BrandMongo.create({
      name: name,
    });
    await res.sendStatus(201);
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
  const brandId = req.params.brandId;
  // Utilisez 'findById' de mongoose
  try {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      const error = new Error('Could not find brand.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(brand);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.delete = async (req, res, next) => {
  const brandId = req.params.brandId;
  try {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      const error = new Error('Could not find brand.');
      error.statusCode = 404;
      throw error;
    }
    await brand.destroy();
    await BrandMongo.deleteOne({ name: brand.name });

    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const brandId = req.params.brandId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;

  try {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      const error = new Error('Could not find brand.');
      error.statusCode = 404;
      throw error;
    }
    await brand.update({ name: name });
    await BrandMongo.updateOne({ name: name });

    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
