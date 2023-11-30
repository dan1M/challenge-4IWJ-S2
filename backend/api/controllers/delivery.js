const { validationResult } = require('express-validator/check');
const User = require('../models/sql/user');
const Cart = require('../models/nosql/cart');

exports.shippingMethods = async (req, res, next) => {
  try {
    const endpoint =
      '/shipping-products?from_country=FR&to_country=FR&weight=1&weight_unit=kilogram';
    const data = await fetch(process.env.SENDCLOUD_API_URL + endpoint, {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SENDCLOUD_PUBLIC_KEY +
              ':' +
              process.env.SENDCLOUD_PRIVATE_KEY,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        let shippingMethods = [];
        // get methods from each item in data
        data.forEach(item => {
          item.methods.forEach(method => {
            shippingMethods.push(method);
          });
        });
        return shippingMethods;
      });

    res.status(200).json(data);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.createPackage = async (req, res, next) => {
  const HS_CODE = '64039118';
  const WEIGHT = '1';

  try {
    const endpoint = '/parcels';

    const user = await User.findByPk(req.user.id);
    const cart = await Cart.findOne({
      user_id: req.user.id,
      cart_step: { $eq: 4 },
    });
    if (!user || !cart) {
      const error = new Error('User or Cart not found.');
      error.statusCode = 404;
      throw error;
    }

    let body = {
      parcel: {
        name: user.firstname + ' ' + user.lastname,
        address: user.address,
        city: user.city,
        postal_code: user.zipcode,
        country: 'FR',
        request_label: true,
        shipment: {
          id: cart.shipment_id,
        },
        parcel_items: [],
      },
    };
    for (const cartProduct of cart.products) {
      body.parcel.parcel_items.push({
        hs_code: HS_CODE,
        weight: WEIGHT,
        description: cartProduct.name,
        quantity: cartProduct.quantity,
        value: cartProduct.price,
        origin_country: 'FR',
      });
    }

    const data = await fetch(process.env.SENDCLOUD_API_URL + endpoint, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SENDCLOUD_PUBLIC_KEY +
              ':' +
              process.env.SENDCLOUD_PRIVATE_KEY,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => response.json());

    res.status(201).json(data);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
