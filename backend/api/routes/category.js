const express = require('express');
const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');

const router = express.Router();

router.get('/', categoryController.getAll);

router.post('/', categoryController.create);

router.put('/:categoryId', categoryController.update);

router.get('/:categoryId', categoryController.findOne);

router.delete('/:categoryId', categoryController.delete);

module.exports = router;
