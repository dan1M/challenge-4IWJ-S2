const { validationResult } = require('express-validator/check');

exports.shippingMethods = async (req, res, next) => {
  try {
    const endpoint =
      '/shipping-products?from_country=FR&to_country=FR&carrier=sendcloud';
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
    }).then(res => res.json());

    res.status(200).json(data[0].methods[0]);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
