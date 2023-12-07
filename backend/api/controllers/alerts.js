const Alert = require('../models/sql/alert');

exports.create = async (req, res, next) => {
  try {
    const alert_type_id = req.body.alert_type_id;
    const user_id = req.body.user_id;
    const category_id = req.body.category_id;
    const label = req.body.label;

    await Alerts.create({
      alert_type_id: alert_type_id,
      user_id: user_id,
      category_id: category_id,
      label: label,
    });

    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserAlerts = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const alerts = await Alert.findAll({
      where: {
        user_id: userId,
      },
    });

    res.status(200).json(alerts);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserAlerts = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await Alert.update(
      {
        status: req.body.status,
        category_id: req.body.categoryId,
        label: req.body.label,
      },
      {
        where: {
          user_id: userId,
          alert_type_id: req.body.alert_type_id,
        },
      },
    );

    res.sendStatus(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
