const {validationResult} = require('express-validator');
const Category = require('../models/category');
const e = require('express');

exports.categoryGetAll = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.status(200).json({
                message: 'Fetched categories successfully.',
                categories: categories
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.categoryPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        throw error
    }
    const id = req.body.id;
    const name = req.body.name;
    const category = new Category({
        id: id,
        name: name
    });
    return category
        .save()
        .then(result => {
            res.status(201).json({message: 'Category created!', id: result._id})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
};

exports.categoryGetById = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Category fetched.', category: category})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.deleteCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            return Category.findByIdAndRemove(categoryId)
        })
        .then(result => {
            res.status(200).json({message: 'Deleted category.'})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.updateCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        throw error
    }
    const id = req.body.id;
    const name = req.body.name;
    Category.findById(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            category.id = id;
            category.name = name;
            return category.save()
        })
        .then(result => {
            res.status(200).json({message: 'Category updated!', category: result})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}