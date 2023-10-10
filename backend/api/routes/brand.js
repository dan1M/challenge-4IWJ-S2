const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const brandController = require('../controllers/brand');

const router = express.Router();

router.get('/', brandController.getAll);

// POST /example
router.post(
  '/',
  [body('name').trim().isLength({ min: 5 })],

  brandController.create,
);

router.put(
  '/:brandId',
  [body('name').trim().isLength({ min: 5 })],

  brandController.update,
);

router.get('/:brandId', brandController.findOne);

router.delete('/:brandId', brandController.delete);

module.exports = router;
