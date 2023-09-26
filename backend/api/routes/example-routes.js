const express = require('express');
// Package qui gère la validation
const { body } = require('express-validator/check');

// Importer votre controller qui contient toutes vos fonctions exportées
const exampleController = require('../controllers/example');

// Créez un router avec express pour gérer chaque requête HTTP (POST, GET, DELETE, etc...)
const router = express.Router();

// GET /example
// Sur la route '/example', j'appelle la fonction exampleGetAll de mon controller
router.get('/example', exampleController.exampleGetAll);

// POST /example
router.post(
  '/post',
  [
    // Le nom des champs pour la validation correspond aux même que ceux que le user va envoyer sur le front
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

// GET par ID example | pour mettre un élément dynamique dans la route comme un Id ou autre, on utilise ':id'
// C'est cet id qu'on récupère dans le controller avec 'req.params.productId'
router.get('/example/:productId', exampleController.exampleGetById);


// Bref vous avez capté
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
