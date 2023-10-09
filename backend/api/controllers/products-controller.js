const { validationResult } = require('express-validator/check');
const Product = require('../models/product.js');

exports.findAll = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.status(200).json({
        message: 'Fetched products successfully.',
        data: products,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.findOne = (req, res, next) => {
  // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
  const postId = req.params.postId;
  // Utilisez 'findById' de mongoose
  Product.findById(postId)
    .then(product => {
      // Si le produit n'existe pas on renvoie une erreur 404 (Not found) pour rentrer dans le catch
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      // Si pas d'erreur, on renvoie une response avec un status 200 et un objet JSON qui contient un message de votre choix et la data
      res.status(200).json({ message: 'Product fetched.', product: product });
    })
    // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
    // Ou le produit n'existe pas (404)
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
      next(err);
    });
};

exports.create = (req, res, next) => {
  // Récupération des erreurs de la validation (voir le fichier de route)
  const errors = validationResult(req);
  // Si il y a une erreur alors on renvoie une erreur 422
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    // le throw error vous ramenera dans le catch tout en bas
    throw error;
  }
  // Si pas d'erreur on récupère les infos rentrés par le user. Ils seront dans l'objet body de la requête.
  const title = req.body.title;
  const description = req.body.description;
  // On instancie un nouvel objet et on renseigne les infos du body dedans.
  const product = new Product({
    title: title,
    description: description,
  });
  // On enregistre ensuite avec la fonction save() qui renvoie une promesse
  return (
    product
      .save()
      // On renvoie une response "res" avec un status 201 (Success + ressource crée) et un JSON qui contient un message de votre choix et l'id de la ressource crée
      .then(result => {
        res
          .status(201)
          .json({ message: 'Product created!', productId: result._id });
      })
      .catch(err => {
        // Si vous entrez ici c'est que soit vous avez pas respecté la validation (422), soit la requete a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
        next(err);
      })
  );
};

exports.exampleDelete = (req, res, next) => {
  // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
  const productId = req.params.productId;
  // Utilisez 'findById' de mongoose
  Product.findById(productId)
    .then(product => {
      // Si le produit n'existe pas on renvoie une erreur 404 (Not found) pour rentrer dans le catch
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      // Si le produit existe, on utilise la fonction findByIdAndRemove de mongoose qui renvoie une promesse
      return Product.findByIdAndRemove(productId);
    })
    .then(result => {
      // On log l'élément supprimé pour s'assurer qu'il a bien été supprimé
      console.log(result);
      // Si pas d'erreur, on renvoie une response avec un status 200 et un objet JSON qui contient un message de votre choix
      res.status(200).json({ message: 'Deleted product.' });
    })
    // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
    // Ou le produit n'existe pas (404)
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
      next(err);
    });
};
