// Importez la fonction que vous souhaitez tester
const { findAll, findOne, update } = require('../controllers/size');
const { validationResult } = require('express-validator/check');

// Importez le modèle que vous utilisez dans la fonction
const SizeMongo = require('../models/nosql/size');
const Size = require('../models/sql/size');

// Utilisez jest.mock pour créer un mock du modèle
jest.mock('../models/nosql/size');
jest.mock('../models/sql/size');

describe('Test de la fonction findAll', () => {
  it('devrait retourner un tableau de tailles', async () => {
    // Définissez le mock pour la fonction find du modèle CategoryMongo
    SizeMongo.find.mockResolvedValue(['Taille 1', 'Taille 2']);

    // Appelez la fonction findAll avec des paramètres fictifs
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findAll(req, res, next);

    // Assurez-vous que la fonction find du modèle a été appelée une fois
    expect(SizeMongo.find).toHaveBeenCalledTimes(1);

    // Assurez-vous que la réponse de la fonction est correcte
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['Taille 1', 'Taille 2']);

    // Assurez-vous que la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner une taille précise', async () => {
    SizeMongo.findById.mockResolvedValue('Taille 1');

    const req = {
      params: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(SizeMongo.findById).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Taille 1');

    expect(next).not.toHaveBeenCalled();
  });

  it("devrait appeler next en cas d'erreur si il ne trouve pas une catégorie précise", async () => {
    // Définissez le mock pour la fonction find du modèle CategoryMongo
    const errorMessage = 'Could not find category.';
    SizeMongo.findById.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: {
        sizeId: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(SizeMongo.findById).toHaveBeenCalledTimes(2);

    expect(next).toHaveBeenCalledWith(expect.any(Error));

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('devrait mettre à jour une taille avec succès', async () => {
    // Mock la fonction validationResult pour simuler une validation réussie
    const req = {
      params: {
        sizeId: 'sizeId',
      },
      body: {
        name: 'Updated Size',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    Size.update.mockResolvedValue([
      1,
      [{ id: 'sizeId', name: 'Updated Size' }],
    ]);

    SizeMongo.updateOne.mockResolvedValue({ nModified: 1 });

    // Appelez la fonction update avec des paramètres fictifs

    await update(req, res, next);

    // Assurez-vous que les fonctions update du modèle Sequelize et CategoryMongo ont été appelées une fois
    expect(Size.update).toHaveBeenCalledTimes(1);
    expect(SizeMongo.updateOne).toHaveBeenCalledTimes(1);

    expect(res.sendStatus).toHaveBeenCalledWith(200);

    // Assurez-vous que la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
  });


});
