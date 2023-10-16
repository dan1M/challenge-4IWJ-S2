const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transporter } = require('../util/mailer');
const User = require('../models/sql/user');
const Token = require('../models/sql/token');
const ejs = require('ejs');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email,
      password: hashedPw,
      firstname: firstname,
      lastname: lastname,
    });

    const token = await Token.create({
      userId: user.id,
      token: jwt.sign(
        {
          email: user.email,
          userId: user.id.toString(),
        },
        'somesupersecretsecret',
        { expiresIn: '1h' },
      ),
    });

    ejs.renderFile(
      '/app/assets/template/template-account-confirmation.ejs',
      {
        firstname: firstname,
        lastname: lastname,
        link: `${process.env.HOST}/auth/verify/${token.token}`,
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        const mailOptions = {
          from: 'challenge.s2@server.com',
          to: user.email,
          subject: 'Verify account',
          html: html,
        };
        transporter.sendMail(mailOptions, err => {
          if (err) {
            throw err;
          }
          res.status(201).json({ message: 'User created!', userId: user.id });
        });
      },
    );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id.toString(),
      },
      'somesupersecretsecret',
      { expiresIn: '1h' },
    );
    res.status(200).json({ token: token, userId: loadedUser.id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      where: { token: req.params.token },
    });
    if (!token) {
      const error = new Error(
        'Your verification link may have expired. Please click on resend for verify your Email.',
      );
      error.statusCode = 401;
      throw error;
    }
    await User.update(
      { active: true },
      {
        where: {
          id: token.userId,
        },
      },
    );
    await token.destroy();
    res.send('Email verified sucessfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
