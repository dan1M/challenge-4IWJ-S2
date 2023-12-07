// Importez la fonction que vous souhaitez tester
let { findAll, findOne, update } = require('../controllers/category');
const categoryController = require('../controllers/category');
const { validationResult } = require('express-validator/check');

// Importez le modèle que vous utilisez dans la fonction
const CategoryMongo = require('../models/nosql/category');
const Category = require('../models/sql/category');

// Utilisez jest.mock pour créer un mock du modèle
jest.mock('../models/nosql/category');
jest.mock('../models/sql/category');



describe('Test de la fonction update', () => {
  it('devrait échouer à mettre à jour une catégorie suite à une validation ratée', async () => {
    // Appelez la fonction update avec des paramètres fictifs
    const req = {
      params: {
        categoryId: 'categoryId',
      },
      body: {
        name: 'U',
      },
    };
    const res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    const next = jest.fn();
  
  
    await update(req, res, next);
  
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('devrait échouer à mettre à jour une catégorie suite à une validation ratée', async () => {
    // Appelez la fonction update avec des paramètres fictifs
    const req = {
      params: {
        categoryId: '',
      },
      body: {
        name: 'Test',
      },
    };
    const res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    const next = jest.fn();
  
  
    await update(req, res, next);
  
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  /*it('devrait mettre à jour une catégorie avec refus', async () => {
    // Mock la fonction validationResult pour simuler une validation réussie
    const req = {
      params: {
        categoryId: 'categoryId',
      },
      body: {
        name: 'Updated Category',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    // Mock la fonction update du modèle Sequelize pour simuler une mise à jour réussie
    Category.update.mockResolvedValue([
      1,
      [{ id: 'categoryId', name: 'Updated Category gg' }],
    ]);

    // Mock la fonction updateOne du modèle MongoDB pour simuler une mise à jour réussie
    CategoryMongo.updateOne.mockResolvedValue({ nModified: 1 });

    // Appelez la fonction update avec des paramètres fictifs

    await update(req, res, next);

    // Assurez-vous que les fonctions update du modèle Sequelize et CategoryMongo ont été appelées une fois
    expect(Category.update).toHaveBeenCalledTimes(1);
    expect(CategoryMongo.updateOne).toHaveBeenCalledTimes(1);

    // Assurez-vous que la réponse de la fonction est correcte
    expect(res.sendStatus).toHaveBeenCalledWith(200);

    // Assurez-vous que la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });*/

});
