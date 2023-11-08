const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies[process.env.JWT_NAME];
  if (!token) return res.sendStatus(401);
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (!user) {
    res.clearCookie('JWT');
    return res.sendStatus(401);
  }

  req.user = user;
  next();
};
