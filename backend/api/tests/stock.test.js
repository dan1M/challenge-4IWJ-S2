let { findAll, findOne, update } = require('../controllers/stock');


const Stock = require('../models/sql/stock');

jest.mock('../models/sql/stock');

describe('Test Stock', () => {
  it('devrait retourner un tableau de stocks', async () => {
    Stock.findAll.mockResolvedValue(['Stock 1', 'Stock 2']);

    const req = {
      query: {page: jest.fn()},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findAll(req, res, next);

    expect(Stock.findAll).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['Stock 1', 'Stock 2']);

    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner un stock précis', async () => {
    Stock.findByPk.mockResolvedValue('Stock 1');

    const req = {
      params: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(Stock.findByPk).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Stock 1');

    expect(next).not.toHaveBeenCalled();
  });

  it("devrait appeler next en cas d'erreur si il ne trouve pas un stock précise", async () => {
    const errorMessage = 'Could not find Stock.';
    Stock.findByPk.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: {
        StockId: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await findOne(req, res, next);

    expect(Stock.findByPk).toHaveBeenCalledTimes(2);

    expect(next).toHaveBeenCalledWith(expect.any(Error));

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

 
});


