const Cart = require('../models/nosql/cart');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      $and: [{ user_id: req.user.id }, { cart_step: { $eq: 4 } }],
    });
    if (!cart) {
      const error = new Error('Cart not found.');
      error.statusCode = 404;
      throw error;
    }
    let checkout_items = [];
    cart.products.forEach(product => {
      checkout_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      });
    });

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: checkout_items,
      mode: 'payment',
      return_url: `${process.env.HOST}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSessionStatus = async (req, res, next) => {
  try {
    if (!req.query.session_id) {
      const error = new Error('Session not found.');
      error.statusCode = 404;
      throw error;
    }
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );
    res.status(200).json(session);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
