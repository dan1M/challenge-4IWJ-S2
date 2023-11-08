const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transporter } = require('../util/mailer');
const User = require('../models/sql/user');
const Lockout = require('../models/sql/lockout');
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
          name: `${user.firstname} ${user.lastname}`,
          if: user.id.toString(),
        },
        process.env.JWT_SECRET,
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
          res.sendStatus(201);
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
    // Vérifiez si le compte est verrouillé
    const lockoutInfo = await Lockout.findOne({ where: { email: email } });
    if (lockoutInfo && lockoutInfo.attempts >= 3) {
      const currentTime = new Date().getTime();
      const lastAttemptTime = lockoutInfo.lastAttempt.getTime();
      const lockoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (currentTime - lastAttemptTime < lockoutDuration) {
        const error = new Error('Account locked. Please try again later.');
        error.statusCode = 401;
        throw error;
      }
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    if (loadedUser.active === false) {
      const error = new Error(
        'You must verify your account. Check your email.',
      );
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // Enregistrez la tentative infructueuse
      if (lockoutInfo) {
        await Lockout.update(
          { attempts: lockoutInfo.attempts + 1, lastAttempt: new Date() },
          { where: { email: email } },
        );
      } else {
        await Lockout.create({
          email: email,
          attempts: 1,
          lastAttempt: new Date(),
        });
      }
      const error = new Error('Wrong password!');
      error.statusCode = 422;
      throw error;
    }

    // Réinitialisez le compteur de tentatives infructueuses
    if (lockoutInfo) {
      await Lockout.update(
        { attempts: 0, lastAttempt: new Date() },
        { where: { email: email } },
      );
    }

    const token = jwt.sign(
      {
        name: `${loadedUser.firstname} ${loadedUser.lastname}`,
        roles: loadedUser.roles,
        id: loadedUser.id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
    res.sendStatus(200);
    res.cookie(process.env.JWT_NAME, token, {
      // secure: true,
      signed: true,
      httpOnly: true,
    });
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
