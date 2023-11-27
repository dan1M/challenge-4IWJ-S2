const { validationResult } = require('express-validator/check');
const Size = require('../models/sql/size');
const SizeMongo = require('../models/nosql/size');
const { modelNames } = require('mongoose');

exports.findAll = async (req, res, next) => {
  try {
    const sizes = await SizeMongo.find();
    res.status(200).json(sizes);
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
    const size = await Size.create({
      name: name,
    });

    await SizeMongo.create({
      _id: size.id,
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
  const sizeId = req.params.sizeId;
  // Utilisez 'findById' de mongoose
  try {
    const size = await SizeMongo.findById(sizeId);
    if (!size) {
      const error = new Error('Could not find size.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(size);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.delete = async (req, res, next) => {
  const sizeId = req.params.sizeId;
  try {
    const size = await Size.findByPk(sizeId);
    if (!size) {
      const error = new Error('Could not find size.');
      error.statusCode = 404;
      throw error;
    }
    await size.destroy();
    await SizeMongo.deleteOne({ name: size.name });

    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const sizeId = req.params.sizeId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }

  try {
    const [nbUpdated, sizes] = await Size.update(req.body, {
      where: {
        id: sizeId,
      },
      returning: true,
    });
    const sizeMongo = await SizeMongo.updateOne(req.body);

    if (sizes[0]) {
      res.status(200).json(sizes[0]);
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
