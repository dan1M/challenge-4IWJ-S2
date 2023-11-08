const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.signedCookies[process.env.JWT_NAME];
  console.log(req);
  if (!token) return res.sendStatus(401);
  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    res.clearCookie(process.env.JWT_NAME);
    return res.sendStatus(401);
  }
  if (
    !user.roles.includes('ROLE_ADMIN') ||
    !user.roles.includes('ROLE_STORE_KEEPER')
  ) {
    return res.sendStatus(401);
  }

  req.user = user;
  next();
};
