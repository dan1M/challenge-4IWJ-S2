const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const Size = require('../models/sql/size');

const sizeController = require('../controllers/size');

const router = express.Router();

router.get('/', sizeController.findAll);

// POST /example
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingSize = await Size.findOne({ where: { name: value } });
        if (existingSize) {
          throw new Error(`Size '${existingSize.name}' already exists.`);
        }
      }),
  ],

  sizeController.create,
);

router.put(
  '/:sizeId',
  [body('name').trim().isLength({ min: 2 })],

  sizeController.update,
);

router.get('/:sizeId', sizeController.findOne);

router.delete('/:sizeId', sizeController.delete);

module.exports = router;
