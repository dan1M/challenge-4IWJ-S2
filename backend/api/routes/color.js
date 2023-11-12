const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const Color = require('../models/sql/color');

const colorController = require('../controllers/color');

const router = express.Router();

router.get('/', colorController.findAll);

// POST /example
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 3 })
      .custom(async value => {
        const existingColor = await Color.findOne({ where: { name: value } });
        if (existingColor) {
          throw new Error(`Color '${existingColor.name}' already exists.`);
        }
      }),
  ],

  colorController.create,
);

router.patch(
  '/:colorId',
  [body('name').trim().isLength({ min: 5 })],

  colorController.update,
);

router.get('/:colorId', colorController.findOne);

router.delete('/:colorId', colorController.delete);

module.exports = router;
