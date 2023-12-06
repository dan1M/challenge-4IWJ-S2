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

exports.findOne = async (req, res, next) => {
  const alertTypeId = req.params.alertTypeId;
  try {
    const alertType = await AlertType.findByPk(alertTypeId);
    if (!alertType) {
      const error = new Error('Could not find alert type.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(alertType);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
