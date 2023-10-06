const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

// Importer votre controller qui contient toutes vos fonctions exportées
const brandController = require('../controllers/brand-controller');

// Créez un router avec express pour gérer chaque requête HTTP (POST, GET, DELETE, etc...)
const router = express.Router();

// GET /example
// Sur la route '/example', j'appelle la fonction exampleGetAll de mon controller
router.get('/brand', brandController.brandGetAll);

// POST /example
router.post(
  '/post',
  [
    // Le nom des champs pour la validation correspond aux même que ceux que le user va envoyer sur le front
    body('id'),
    body('name')
      .trim()
      .isLength({ min: 5 })
  ],

  brandController.brandPost
);

// GET par ID example | pour mettre un élément dynamique dans la route comme un Id ou autre, on utilise ':id'
// C'est cet id qu'on récupère dans le controller avec 'req.params.productId'
router.get('/brand/:brandId', brandController.brandGetById);


// Bref vous avez capté
router.delete('/brand/:brandId', brandController.deleteBrand);

// PUT /example
router.put(
  '/brand/:brandId',
  [
    body('id'),
    body('name')
      .trim()
      .isLength({ min: 5 })
  ],
  brandController.updateBrand
);

module.exports = router;