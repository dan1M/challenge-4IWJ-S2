const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const brandController = require('../controllers/brand');

const router = express.Router();

router.get('/', brandController.brandGetAll);

// POST /example
router.post(
  '/create',
  [body('id'), body('name').trim().isLength({ min: 5 })],

  brandController.brandPost,
);

router.put(
  '/:brandId',
  [+body('id'), body('name').trim().isLength({ min: 5 })],

  brandController.updateBrand,
);

router.get('/:brandId', brandController.brandGetById);

router.delete('/:brandId', brandController.brandDelete);

module.exports = router;
