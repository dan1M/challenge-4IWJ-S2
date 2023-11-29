const AlertType = require('../models/sql/alert-type');

exports.create = async (req, res, next) => {
  try {
    const type = req.body.type;
    await AlertType.create({
      type: type,
    });

    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
