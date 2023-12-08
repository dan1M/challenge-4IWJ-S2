const User = require('../models/sql/user');
const OrderMongo = require('../models/nosql/order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CsvParser = require('json2csv').Parser;

exports.getUserInfo = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

  
exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [ 'password', 'createdAt', 'updatedAt', 'active'],
      },
    });
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const nbUser = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (nbUser[0] === 0) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findByPk(req.params.id);

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign(
      {
        name: `${user.firstname} ${user.lastname}`,
        roles: user.roles,
        id: user.id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
    res.cookie(process.env.JWT_NAME, token, {
      secure: true,
      signed: true,
      httpOnly: true,
      overwrite: true,
    });

    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  try {
    console.log(req.user.id, 'IDDDDDD');
    const user = await User.findByPk(req.user.id);

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isEqual) {
      const error = new Error('Wrong old password.');
      error.statusCode = 422;
      throw error;
    }

    if (newPassword !== confirmPassword) {
      const error = new Error('Password does not match.');
      error.statusCode = 422;
      throw error;
    }

    const hashedPw = await bcrypt.hash(newPassword, 12);

    user.password = hashedPw;

    user.save();

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
    const hashedEmail = await bcrypt.hash(user.email, 12);
    user.email = hashedEmail;
    user.firstname = 'Compte';
    user.lastname = 'Supprimé';
    user.save();
    res.clearCookie(process.env.JWT_NAME);
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
   
    });
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  } };


exports.downloadUserData = async (req, res, next) => {
  let userData = [];
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    // const userOrders = await OrderMongo.find({ user_id: req.user.id });
    const { firstname, lastname, email, dob, address, city, zipcode } = user;
    userData.push({
      firstname,
      lastname,
      email,
      dob,
      address,
      city,
      zipcode,
    });

    const csvFields = [
      'Prénom',
      'Nom',
      'Email',
      'Date de naissance',
      'Adresse',
      'Ville',
      'Code Postal',
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(userData);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachtchment: filename=userData.csv',
    );
    res.status(200).end(csvData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
