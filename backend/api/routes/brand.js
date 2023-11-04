const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const Brand = require('../models/sql/brand');

const brandController = require('../controllers/brand');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, brandController.findAll);

// POST /example
router.post(
  '/',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 5 })
      .custom(async value => {
        const existingBrand = await Brand.findOne({ where: { name: value } });
        if (existingBrand) {
          throw new Error(`Brand '${existingBrand.name}' already exists.`);
        }
      }),
  ],

  brandController.create,
);

router.put(
  '/:brandId',
  isAuth,

  [body('name').trim().isLength({ min: 5 })],

  brandController.update,
);

router.get('/:brandId', isAuth, brandController.findOne);

router.delete('/:brandId', isAuth, brandController.delete);

module.exports = router;
