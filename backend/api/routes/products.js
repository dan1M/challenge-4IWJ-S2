const express = require('express');
const { body } = require('express-validator/check');

const productsController = require('../controllers/products');

const Product = require('../models/sql/product');

const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAdmin, productsController.findAll);

router.get('/:productId', isAdmin, productsController.findOne);

router.post(
  '/',
  isAdmin,
  [
    body('title')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingProduct = await Product.findOne({
          where: { title: value },
        });
        if (existingProduct) {
          throw new Error(`Product '${existingProduct.name}' already exists.`);
        }
      }),
    body('description').trim(),
    body('price').isFloat({ gt: 0 }),
    body('stock').optional().isInt({ gt: -1 }),
  ],
  productsController.create,
);

router.put(
  '/:productId',
  isAdmin,
  [
    body('title').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim(),
    body('price').optional().isFloat({ gt: 0 }),
    body('stock').optional().isInt({ gt: -1 }),
  ],
  productsController.update,
);

router.delete('/:productId', isAdmin, productsController.delete);

module.exports = router;
