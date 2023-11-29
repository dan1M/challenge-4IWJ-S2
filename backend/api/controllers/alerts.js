const Alerts = require('../models/sql/alert');

exports.create = async (req, res, next) => {
  try {
    const alert_type_id = req.body.alert_type_id;
    const user_id = req.body.user_id;
    const category_id = req.body.category_id;
    const product_id = req.body.product_id;

    await Alerts.create({
      alert_type_id: alert_type_id,
      user_id: user_id,
      category_id: category_id,
      product_id: product_id,
    });

    res.sendStatus(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
