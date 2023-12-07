// Importez la fonction que vous souhaitez tester
const { findAll, findOne, update } = require('../controllers/category');
const { validationResult } = require('express-validator/check');

// Importez le modèle que vous utilisez dans la fonction
const CategoryMongo = require('../models/nosql/category');
const Category = require('../models/sql/category');

// Utilisez jest.mock pour créer un mock du modèle
jest.mock('../models/nosql/category');
jest.mock('../models/sql/category');

describe('Test de la fonction findAll', () => {
  it('devrait retourner un tableau de catégories', async () => {
    // Définissez le mock pour la fonction find du modèle CategoryMongo
    CategoryMongo.find.mockResolvedValue(['Catégorie 1', 'Catégorie 2']);

    // Appelez la fonction findAll avec des paramètres fictifs
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findAll(req, res, next);

    // Assurez-vous que la fonction find du modèle a été appelée une fois
    expect(CategoryMongo.find).toHaveBeenCalledTimes(1);

    // Assurez-vous que la réponse de la fonction est correcte
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['Catégorie 1', 'Catégorie 2']);

    // Assurez-vous que la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner une catégorie précise', async () => {
    // Définissez le mock pour la fonction find du modèle CategoryMongo
    CategoryMongo.findById.mockResolvedValue('Catégorie 1');

    const req = {
      params: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    // Assurez-vous que la fonction find du modèle a été appelée une fois
    expect(CategoryMongo.findById).toHaveBeenCalledTimes(1);

    // Assurez-vous que la réponse de la fonction est correcte
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Catégorie 1');

    // Assurez-vous que la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
  });

  it("devrait appeler next en cas d'erreur si il ne trouve pas une catégorie précise", async () => {
    // Définissez le mock pour la fonction find du modèle CategoryMongo
    const errorMessage = 'Could not find category.';
    CategoryMongo.findById.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: {
        categoryId: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    // Assurez-vous que la fonction find du modèle a été appelée une fois
    expect(CategoryMongo.findById).toHaveBeenCalledTimes(2);

    // Assurez-vous que la fonction next a été appelée avec l'erreur appropriée
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    // Assurez-vous que la fonction res.status et res.json n'ont pas été appelées
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // it('devrait mettre à jour une catégorie avec succès', async () => {
  //   // Mock la fonction validationResult pour simuler une validation réussie
  //   const req = {
  //     params: {
  //       categoryId: 'categoryId',
  //     },
  //     body: {
  //       name: 'Updated Category',
  //     },
  //   };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //     sendStatus: jest.fn(),
  //   };
  //   const next = jest.fn();

  //   // Mock la fonction update du modèle Sequelize pour simuler une mise à jour réussie
  //   Category.update.mockResolvedValue([
  //     1,
  //     [{ id: 'categoryId', name: 'Updated Category' }],
  //   ]);

  //   // Mock la fonction updateOne du modèle MongoDB pour simuler une mise à jour réussie
  //   CategoryMongo.updateOne.mockResolvedValue({ nModified: 1 });

  //   // Appelez la fonction update avec des paramètres fictifs

  //   await update(req, res, next);

  //   // Assurez-vous que les fonctions update du modèle Sequelize et CategoryMongo ont été appelées une fois
  //   expect(Category.update).toHaveBeenCalledTimes(1);
  //   expect(CategoryMongo.updateOne).toHaveBeenCalledTimes(1);

  //   // Assurez-vous que la réponse de la fonction est correcte
  //   expect(res.sendStatus).toHaveBeenCalledWith(200);

  //   // Assurez-vous que la fonction next n'a pas été appelée
  //   expect(next).not.toHaveBeenCalled();
  //   expect(res.json).not.toHaveBeenCalled();
  // });

  // it('devrait échouer à mettre à jour une catégorie suite à une validation ratée', async () => {
  //   // Appelez la fonction update avec des paramètres fictifs
  //   const req = {
  //     params: {
  //       categoryId: 'categoryId',
  //     },
  //     body: {
  //       name: 'U',
  //     },
  //   };
  //   const res = {
  //     json: jest.fn(),
  //     sendStatus: jest.fn(),
  //   };
  //   const next = jest.fn();

  //   await update(req, res, next);

  //   expect(next).toHaveBeenCalledWith(expect.any(Error));

  //   expect(res.sendStatus).not.toHaveBeenCalled();
  //   expect(res.json).not.toHaveBeenCalled();
  // });
});
