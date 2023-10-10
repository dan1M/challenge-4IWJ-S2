const express = require('express');
const { body } = require('express-validator/check');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.findAll);

router.get('/:productId', productsController.findOne);

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2 }),
    body('description').optional().trim(),
    body('price').isFloat({ gt: 0 }),
    body('stock').optional().isInt({ gt: -1 }),
  ],
  productsController.create,
);

router.put(
  '/:productId',
  [
    body('title').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim(),
    body('price').optional().isFloat({ gt: 0 }),
    body('stock').optional().isInt({ gt: -1 }),
  ],
  productsController.update,
);

router.delete('/:productId', productsController.delete);

module.exports = router;
