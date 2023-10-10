const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const brandController = require('../controllers/brand');

const router = express.Router();

router.get('/', brandController.brandGetAll);

// POST /example
router.post(
  '/create',
  [
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],

  brandController.brandPost,
);

router.put(
  '/:brandId',
  [
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],

  brandController.updateBrand,
);

router.get('/:brandId', brandController.brandGetById);

router.delete('/:brandId', brandController.brandDelete);

module.exports = router;
