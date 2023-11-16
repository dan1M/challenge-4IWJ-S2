const User = require('../models/sql/user');
const jwt = require('jsonwebtoken');

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
