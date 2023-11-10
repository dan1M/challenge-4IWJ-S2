const express = require('express');
const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');

const Category = require('../models/sql/category');

const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', categoryController.findAll);

router.post(
  '/',
  isAdmin,
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

router.put('/:categoryId', isAdmin, categoryController.update);

router.get('/:categoryId', categoryController.findOne);

router.delete('/:categoryId', isAdmin, categoryController.delete);

module.exports = router;
