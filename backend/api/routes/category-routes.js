const express = require('express');
const {body} = require('express-validator/check');

const categoryController = require('../controllers/category');

const router = express.Router();

router.get('/category', categoryController.categoryGetAll);

router.post(
    '/category',
    [
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    categoryController.categoryPost
);

router.get('/category/:categoryId', categoryController.categoryGetById);

router.delete('/category/:categoryId', categoryController.deleteCategory);

router.put(
    '/category/:categoryId',
    [
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    categoryController.updateCategory
);

module.exports = router;