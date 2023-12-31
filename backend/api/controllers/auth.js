const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transporter } = require('../util/mailer');
const User = require('../models/sql/user');
const Lockout = require('../models/sql/lockout');
const Token = require('../models/sql/token');
const AlertType = require('../models/sql/alert-type');
const Alert = require('../models/sql/alert');
const ejs = require('ejs');
const { alertNewsletter } = require('../util/createAlert');
const { send } = require('../util/mailer');

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
    const dob = req.body.dob;
    const address = req.body.address;
    const zipcode = req.body.zipcode;
    const city = req.body.city;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);
    const newsletter = req.body.newsletter;

    const user = await User.create({
      email: email,
      password: hashedPw,
      firstname: firstname,
      lastname: lastname,
      dob: dob,
      address: address,
      zipcode: zipcode,
      city: city,
      newsletter: newsletter,
    });

    const alertsType = await AlertType.findAll();

    alertsType.forEach(async alertType => {
      await Alert.create({
        alert_type_id: alertType.id,
        user_id: user.id,
      });
    });

    if (user.newsletter) {
      alertNewsletter(user);
    }

    const token = await Token.create({
      userId: user.id,
      token: require('crypto').randomBytes(32).toString('hex'),
    });

    ejs.renderFile(
      './assets/template/template-account-confirmation.ejs',
      {
        firstname: firstname,
        lastname: lastname,
        link: `${process.env.FRONT_URL}/verify/${token.token}`,
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        const mailOptions = {
          from: 'challenge.s2@server.com',
          to: user.email,
          subject: 'Confirmation du compte',
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
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      const error = new Error(
        "Un utilisateur avec ce mail n'a pas pu être trouvé.",
      );
      error.statusCode = 404;
      throw error;
    }
    loadedUser = user;
    if (loadedUser.active === false) {
      const error = new Error('Vous devez confirmer votre compte.');
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
      const error = new Error('Mauvais mot de passe !');
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
        canAccessDashboard: loadedUser.roles.includes('ROLE_ADMIN'),
        id: loadedUser.id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
    res.cookie(process.env.JWT_NAME, token, {
      // secure: true,
      signed: true,
      httpOnly: true,
    });

    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const token = req.signedCookies[process.env.JWT_NAME];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (user) {
    res.clearCookie(process.env.JWT_NAME);
    res.sendStatus(204);
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
    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    await user.destroy();
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkToken = async (req, res, next) => {
  const tokenParams = req.params.token;
  try {
    const token = await Token.findOne({
      where: {
        token: tokenParams,
      },
    });

    if (!token) {
      const error = new Error('Could not find token.');
      error.statusCode = 404;
      throw error;
    }

    await token.destroy();

    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    let token = await Token.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!token) {
      token = await Token.create({
        userId: user.id,
        token: jwt.sign(
          {
            name: `${user.firstname} ${user.lastname}`,
            id: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
        ),
      });
    }

    ejs.renderFile(
      '/app/assets/template/template-reset-password.ejs',
      {
        firstname: user.firstname,
        link: `${process.env.FRONT_URL}/reset-password`,
      },
      (err, html) => {
        if (err) {
          throw err;
        }
        const mailOptions = {
          from: 'challenge.s2@server.com',
          to: user.email,
          subject: 'Réinitialisation de votre mot de passe',
          html: html,
        };
        res.cookie(process.env.JWT_RESET_PASSWORD, token.token, {
          // secure: true,
          signed: true,
          httpOnly: true,
        });
        transporter.sendMail(mailOptions, err => {
          if (err) {
            throw err;
          }
          res.sendStatus(200);
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

exports.changePassword = async (req, res, next) => {
  try {
    const cookieToken = req.signedCookies[process.env.JWT_RESET_PASSWORD];

    const user = jwt.verify(cookieToken, process.env.JWT_SECRET);

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    const token = await Token.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!token) {
      const error = new Error('Could not find token.');
      error.statusCode = 404;
      throw error;
    }
    const hashedPw = await bcrypt.hash(req.body.newPassword, 12);
    await User.update(
      { password: hashedPw },
      {
        where: {
          id: user.id,
        },
      },
    );
    await token.destroy();
    res.clearCookie(process.env.JWT_RESET_PASSWORD);
    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.newsletter = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      send(
        './assets/template/template-newsletter.ejs',
        {
          firstname: 'nouveau client',
          link: 'http://localhost:5173',
        },
        req.body.email,
        `Inscription à la newsletter`,
      );
      res.sendStatus(200);
    } else if (user.newsletter) {
      const error = new Error('Utilisateur déja inscrit à la newsletter.');
      error.statusCode = 403;
      throw error;
    } else {
      send(
        './assets/template/template-newsletter.ejs',
        {
          firstname: user.firstname,
          link: 'http://localhost:5173',
        },
        user.email,
        `Inscription à la newsletter`,
      );
      res.sendStatus(200);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
