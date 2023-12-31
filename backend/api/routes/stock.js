const express = require('express');
const { body } = require('express-validator/check');

const stockController = require('../controllers/stock');

const Stock = require('../models/sql/stock');
const Product = require('../models/sql/product');
const Size = require('../models/sql/size');
const Color = require('../models/sql/color');

const router = express.Router();

router.get('/', stockController.findAll);

router.get('/:stockId', stockController.findOne);
router.get('/product/:productId', stockController.findStocksByProduct);

router.post(
  '/',
  [
    body('quantity').isFloat({ gt: 0 }),
    body('product')
      .trim()
      .custom(async (value,{req}) => {
        const existingProduct = await Product.findByPk(value);
        if (!existingProduct) {
          throw new Error('Could not find product.');
        }
        const existingStock = await Stock.findOne({
          where: {
            product_id: value,
            size_id: req.body.size,
            color_id: req.body.color,
          },
        });
        
        if (existingStock) {
          throw new Error('Un stock avec ces valeurs existe déjà.');
        }
      }),
    body('size')
      .trim()
      .custom(async value => {
        const existingSize = await Size.findByPk(value);
        if (!existingSize) {
          throw new Error('Could not find size.');
        }
      }),
    body('color')
      .trim()
      .custom(async value => {
        const existingColor = await Color.findByPk(value);
        if (!existingColor) {
          throw new Error('Could not find color.');
        }
      }),
  ],
  stockController.create,
);

router.patch(
  '/:stockId',
  [
    body('quantity').isFloat({ gt: 0 }),
    body('product').trim(),
    body('size').trim(),
    body('color').trim(),
  ],
  stockController.update,
);

router.delete('/:stockId', stockController.delete);

module.exports = router;
