const express = require('express');
const { body } = require('express-validator/check');

const isAdmin = require('../middleware/is-admin');

const User = require('../models/sql/user');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/me', isAuth, userController.getUserInfo);

router.get('/download', isAuth, userController.downloadUserData);

router.patch(
  '/password',
  isAuth,
  [
    body('oldPassword')
      .trim()
      .isLength({ min: 12 })
      .withMessage('Le mot de passe doit comporter au moins 12 caractères')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      )
      .withMessage(
        'Le mot de passe doit contenir des symboles, des chiffres, des lettres minuscules et des lettres majuscules',
      ),
    body('newPassword')
      .trim()
      .isLength({ min: 12 })
      .withMessage('Le mot de passe doit comporter au moins 12 caractères')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      )
      .withMessage(
        'Le mot de passe doit contenir des symboles, des chiffres, des lettres minuscules et des lettres majuscules',
      ),
    body('confirmPassword')
      .trim()
      .isLength({ min: 12 })
      .withMessage('Le mot de passe doit comporter au moins 12 caractères')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      )
      .withMessage(
        'Le mot de passe doit contenir des symboles, des chiffres, des lettres minuscules et des lettres majuscules',
      ),
  ],
  userController.updatePassword,
);

router.post('/getUserByEmail', userController.getUserByEmail);

router.get('/:userId', userController.getUser);

router.patch('/:id', isAuth, userController.update);

router.delete('/:id', userController.delete);

module.exports = router;
