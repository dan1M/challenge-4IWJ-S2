const Cart = require('../models/nosql/cart');
const User = require('../models/sql/user');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const cart = await Cart.findOne({
      user_id: req.user.id,
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
      customer_email: user.email,
      receipt_email: user.email,
      return_url: `${process.env.FRONT_URL}/cart/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
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
