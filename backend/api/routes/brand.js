const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

const brandController = require('../controllers/brand');

const router = express.Router();

router.get('/', brandController.getAll);

// POST /example
router.post(
<<<<<<< Updated upstream
  '/create',
  [
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
=======
  '/',
  [body('id'), body('name').trim().isLength({ min: 5 })],
>>>>>>> Stashed changes

  brandController.create,
);

router.put(
  '/:brandId',
<<<<<<< Updated upstream
  [
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
=======
  [body('id'), body('name').trim().isLength({ min: 5 })],
>>>>>>> Stashed changes

  brandController.update,
);

router.get('/:brandId', brandController.findOne);

router.delete('/:brandId', brandController.delete);

module.exports = router;
