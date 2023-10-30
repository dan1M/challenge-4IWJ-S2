const express = require('express');
const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');

const Category = require('../models/sql/category');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, categoryController.findAll);

router.post(
  '/',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 5 })
      .custom(async value => {
        const existingCategory = await Category.findOne({
          where: { name: value },
        });
        if (existingCategory) {
          throw new Error(
            `Category '${existingCategory.name}' already exists.`,
          );
        }
      }),
  ],
  categoryController.create,
);

router.put('/:categoryId', isAuth, categoryController.update);

router.get('/:categoryId', isAuth, categoryController.findOne);

router.delete('/:categoryId', isAuth, categoryController.delete);

module.exports = router;
