const { validationResult } = require('express-validator/check');
const Brand = require('../models/sql/brand');
const BrandMongo = require('../models/nosql/brand');

const e = require('express');

exports.getAll = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json({
      message: 'Fetched brands successfully.',
      brands: brands,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    // Si il y a une erreur alors on renvoie une erreur 422
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

    res.status(201).json({ message: 'Brand created!', id: brand.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
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
    res.status(200).json({ message: 'Brand fetched.', brand: brand });
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
    await Brand.destroy({
      where: {
        id: brandId,
      },
    });
    res.status(200).json({ message: 'Brand deleted.', brand: brand });
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
    const updatedBrand = await Brand.update(
      { name: name },
      {
        where: {
          id: brandId,
        },
      },
    );
    res.status(200).json({ message: 'Brand updated!', brand: updatedBrand });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
