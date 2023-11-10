const jwt = require('jsonwebtoken');
const User = require('../models/sql/user');

module.exports = (req, res, next) => {
  const token = req.signedCookies[process.env.JWT_NAME];
  if (!token) return res.sendStatus(401);
  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    res.clearCookie(process.env.JWT_NAME);
    return res.sendStatus(401);
  }
  if (!user.roles.includes('ROLE_ADMIN')) {
    return res.sendStatus(401);
  }

  req.user = user;
  next();
};
