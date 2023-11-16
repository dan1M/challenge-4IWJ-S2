const express = require('express');
const { body } = require('express-validator/check');

const isAdmin = require('../middleware/is-admin');

const User = require('../models/sql/user');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/me', isAuth, userController.getUserInfo);

router.get('/:userId', userController.getUser);

router.patch('/:id', isAuth, userController.update);

module.exports = router;
