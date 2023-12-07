let { findAll, findOne, update } = require('../controllers/products');


const ProductMongo = require('../models/nosql/product');
const Product = require('../models/sql/product');

jest.mock('../models/nosql/product');
jest.mock('../models/sql/product');

describe('Test product', () => {
  /*it('devrait retourner un tableau de produits', async () => {
    ProductMongo.find.mockResolvedValue(['product 1', 'product 2']);

    const req = {
      query: {page: jest.fn()},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findAll(req, res, next);

    expect(ProductMongo.find).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['product 1', 'product 2']);

    expect(next).not.toHaveBeenCalled();
  });*/

  it('devrait retourner un produit précise', async () => {
    ProductMongo.findById.mockResolvedValue('Product 1');

    const req = {
      params: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(ProductMongo.findById).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Product 1');

    expect(next).not.toHaveBeenCalled();
  });

  it("devrait appeler next en cas d'erreur si il ne trouve pas un produit précis", async () => {
    const errorMessage = 'Could not find Product.';
    ProductMongo.findById.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: {
        productId: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(ProductMongo.findById).toHaveBeenCalledTimes(2);

    expect(next).toHaveBeenCalledWith(expect.any(Error));

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('devrait mettre à jour un produit avec succès', async () => {
    const req = {
      params: {
        productId: 'ProductId',
      },
      body: {
        name: 'Updated Product',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    Product.update.mockResolvedValue([
      1,
      [{ id: 'ProductId', name: 'Updated Product' }],
    ]);

    ProductMongo.updateOne.mockResolvedValue({ nModified: 1 });


    await update(req, res, next);

    expect(Product.update).toHaveBeenCalledTimes(1);

    expect(res.sendStatus).toHaveBeenCalledWith(200);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  

});


