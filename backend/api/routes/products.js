const express = require('express');
const { body } = require('express-validator/check');

const productsController = require('../controllers/products');

const Product = require('../models/sql/product');

const isAuth = require('../middleware/is-auth');

const Category = require('../models/sql/category');
const Color = require('../models/sql/color');
const Size = require('../models/sql/size');

const router = express.Router();

router.get('/', isAuth, productsController.findAll);

router.get('/:productId', isAuth, productsController.findOne);

router.post(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingProduct = await Product.findOne({
          where: { title: value },
        });
        if (existingProduct) {
          throw new Error(`Product '${existingProduct.title}' already exists.`);
        }
      }),
    body('description').trim(),
    body('category')
      .isInt()
      .custom(async value => {
        const existingCategory = await Category.findByPk(value);
        if (!existingCategory) {
          throw new Error('Could not find category.');
        }
      }),
    body('variants').isArray(),
    body('variants.*.size')
      .isInt()
      .custom(async value => {
        const existingSize = await Size.findByPk(value);
        if (!existingSize) {
          throw new Error('Could not find size.');
        }
      }),
    body('variants.*.colors.*.color')
      .isInt()
      .custom(async value => {
        const existingColor = await Color.findByPk(value);
        if (!existingColor) {
          throw new Error('Could not find color.');
        }
      }),
  ],
  productsController.create,
);

router.put(
  '/:productId',
  isAuth,
  [
    body('title').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim(),
  ],
  productsController.update,
);

router.delete('/:productId', isAuth, productsController.delete);

module.exports = router;
