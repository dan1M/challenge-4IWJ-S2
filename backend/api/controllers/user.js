const User = require('../models/sql/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        exclude: ['roles', 'password', 'createdAt', 'updatedAt', 'active'],
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
      // secure: true,
      signed: true,
      httpOnly: true,
      overwrite: true,
    });

    res.sendStatus(204);
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

    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
