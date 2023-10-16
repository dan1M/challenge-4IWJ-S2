const express = require('express');
const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');

const Category = require('../models/sql/category');

const router = express.Router();

router.get('/', categoryController.getAll);

router.post(
  '/',
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

router.put('/:categoryId', categoryController.update);

router.get('/:categoryId', categoryController.findOne);

router.delete('/:categoryId', categoryController.delete);

module.exports = router;
