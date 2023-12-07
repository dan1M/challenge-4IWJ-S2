let { findAll, findOne, update } = require('../controllers/category');
const categoryController = require('../controllers/category');
const { validationResult } = require('express-validator/check');

const CategoryMongo = require('../models/nosql/category');
const Category = require('../models/sql/category');

jest.mock('../models/nosql/category');
jest.mock('../models/sql/category');

describe('Test categorie', () => {
  it('devrait retourner un tableau de catégories', async () => {
    CategoryMongo.find.mockResolvedValue(['Catégorie 1', 'Catégorie 2']);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findAll(req, res, next);

    expect(CategoryMongo.find).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['Catégorie 1', 'Catégorie 2']);

    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner une catégorie précise', async () => {
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

    expect(CategoryMongo.findById).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Catégorie 1');

    expect(next).not.toHaveBeenCalled();
  });

  it("devrait appeler next en cas d'erreur si il ne trouve pas une catégorie précise", async () => {
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

    expect(CategoryMongo.findById).toHaveBeenCalledTimes(2);

    expect(next).toHaveBeenCalledWith(expect.any(Error));

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('devrait mettre à jour une catégorie avec succès', async () => {
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

    Category.update.mockResolvedValue([
      1,
      [{ id: 'categoryId', name: 'Updated Category' }],
    ]);

    CategoryMongo.updateOne.mockResolvedValue({ nModified: 1 });


    await update(req, res, next);

    expect(Category.update).toHaveBeenCalledTimes(1);
    expect(CategoryMongo.updateOne).toHaveBeenCalledTimes(1);

    expect(res.sendStatus).toHaveBeenCalledWith(200);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  

});


