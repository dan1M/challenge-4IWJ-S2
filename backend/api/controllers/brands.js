const { validationResult } = require("express-validator/check");
const Brand = require("../models/brand");
const e = require("express");


exports.brandGetAll = (req, res, next) => {
  Brand.find()
    .then((brands) => {
      // Si pas d'erreur, on renvoie une response 200, avec un objet JSON contenant un message de votre choix et les données
      res.status(200).json({
        message: "Fetched posts successfully.",
        brands: brands,
      });
    })
    // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
      next(err);
    });
};

// Exemple POST (CRUD)

exports.brandPost = (req, res, next) => {
  // Récupération des erreurs de la validation (voir le fichier de route)
  const errors = validationResult(req);
  // Si il y a une erreur alors on renvoie une erreur 422
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    // le throw error vous ramenera dans le catch tout en bas
    throw error;
  }
  // Si pas d'erreur on récupère les infos rentrés par le user. Ils seront dans l'objet body de la requête.
  const id = req.body.id;
  const name = req.body.name;
  // On instancie un nouvel objet et on renseigne les infos du body dedans.
  const brand = new Brand({
    id: id,
    name: name,
  });
  // On enregistre ensuite avec la fonction save() qui renvoie une promesse
  return (
    brand
      .save()
      // On renvoie une response "res" avec un status 201 (Success + ressource crée) et un JSON qui contient un message de votre choix et l'id de la ressource crée
      .then((result) => {
        res
          .status(201)
          .json({ message: "Brand created!", id: result._id });
      })
      .catch((err) => {
        // Si vous entrez ici c'est que soit vous avez pas respecté la validation (422), soit la requete a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
        next(err);
      })
  );
};

// Exemple GET par ID (CRUD)
exports.brandGetById = (req, res, next) => {
  // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
  const postId = req.params.postId;
  // Utilisez 'findById' de mongoose
  Brand.findById(postId)
    .then((brand) => {
      // Si le produit n'existe pas on renvoie une erreur 404 (Not found) pour rentrer dans le catch
      if (!brand) {
        const error = new Error("Could not find brand.");
        error.statusCode = 404;
        throw error;
      }
      // Si pas d'erreur, on renvoie une response avec un status 200 et un objet JSON qui contient un message de votre choix et la data
      res.status(200).json({ message: "Brand fetched.", brand: brand });
    })
    // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
    // Ou le produit n'existe pas (404)
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
      next(err);
    });
};

exports.brandDelete = (req, res, next) => {
  // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
  const id = req.params.id;
  // Utilisez 'findById' de mongoose
  Brand.findById(id)
    .then((brand) => {
      // Si le produit n'existe pas on renvoie une erreur 404 (Not found) pour rentrer dans le catch
      if (!brand) {
        const error = new Error("Could not find brand.");
        error.statusCode = 404;
        throw error;
      }
      // Si le produit existe, on utilise la fonction findByIdAndRemove de mongoose qui renvoie une promesse
      return Brand.findByIdAndRemove(id);
    })
    .then((result) => {
      // On log l'élément supprimé pour s'assurer qu'il a bien été supprimé
      console.log(result);
      // Si pas d'erreur, on renvoie une response avec un status 200 et un objet JSON qui contient un message de votre choix
      res.status(200).json({ message: "Deleted brand." });
    })
    // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
    // Ou le produit n'existe pas (404)
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
      next(err);
    });
};

// Exemple PUT (CRUD)
exports.brandUpdate = (req, res, next) => {
    // Récupération des erreurs de la validation (voir le fichier de route)
    const errors = validationResult(req);
    // Si il y a une erreur alors on renvoie une erreur 422
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        // le throw error vous ramenera dans le catch tout en bas
        throw error;
    }
    // On récupère l'Id qui est dans l'URL avec l'objet 'params' de la requête
    const id = req.params.id;
    // On récupère les infos du body
    const name = req.body.name;
    // On instancie un nouvel objet et on renseigne les infos du body dedans.
    const brand = new Brand({
        id: id,
        name: name,
    });
    // On utilise la fonction findByIdAndUpdate de mongoose qui renvoie une promesse
    Brand.findByIdAndUpdate(id, brand)
        .then((result) => {
        // Si pas d'erreur, on renvoie une response avec un status 200 et un objet JSON qui contient un message de votre choix
        res.status(200).json({ message: "Brand updated!", brand: brand });
        })
        // Si vous entrez ici c'est que la requete n'a pas fonctionné (500) pour une raison inconnue (soucis réseau etc..)
        // Ou le produit n'existe pas (404)
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        // Le next(err) va appeler la route spécialement faite pour les erreurs (voir index.js)
        next(err);
        });
}