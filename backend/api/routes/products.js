const express = require('express');
const { body } = require('express-validator/check');

const productsController = require('../controllers/products');

const Product = require('../models/sql/product');

const isAdmin = require('../middleware/is-admin');

const Category = require('../models/sql/category');
const Color = require('../models/sql/color');
const Size = require('../models/sql/size');

const router = express.Router();

router.get('/', productsController.findAll);

router.get('/:productId', productsController.findOne);

router.post(
  '/',
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
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
          throw new Error(`Product '${existingProduct.title}' already exists.`);
        }
      }),
    body('description').trim(),
    body('category')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingCategory = await Category.findByPk(value);
        if (!existingCategory) {
          throw new Error('Could not find category.');
        }
      }),
    body('variants').isArray(),
    body('variants.*.size')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingSize = await Size.findByPk(value);
        if (!existingSize) {
          throw new Error('Could not find size.');
        }
      }),
    body('variants.*.colors.*.color')
      .trim()
      .isLength({ min: 2 })
      .custom(async value => {
        const existingColor = await Color.findByPk(value);
        if (!existingColor) {
          throw new Error('Could not find color.');
        }
      }),
  ],
  productsController.create,
);

router.patch(
  '/:productId',
  isAdmin,
  [
    body('title').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim(),
  ],
  productsController.update,
);

router.delete('/:productId', isAdmin, productsController.delete);

module.exports = router;
