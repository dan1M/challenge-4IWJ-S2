const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/sql/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async value => {
        const existingUser = await User.findOne({ where: { email: value } });
        if (existingUser) {
          throw new Error('E-mail already in use');
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 12 })
      .withMessage('Le mot de passe doit comporter au moins 12 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage('Le mot de passe doit contenir des symboles, des chiffres, des lettres minuscules et des lettres majuscules'),
    body('firstname')
      .trim()
      .not()
      .isEmpty(),
    body('lastname')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup,
);

router.post('/login', authController.login);

module.exports = router;
