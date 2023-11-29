const Alert = require('../models/sql/alert');
const User = require('../models/sql/user');
const Category = require('../models/sql/category');
const Product = require('../models/sql/product');

const { transporter, send } = require('./mailer');
const ejs = require('ejs');

const alertNewProduct = async product => {
  try {
  } catch (err) {}
  const alerts = await Alert.findAll({
    where: {
      alert_type_id: 'ac2a1753-7fd9-46f4-9c6c-a16f5412d285',
      category_id: product.category_id,
    },
  });

  const category = await Category.findByPk(product.category_id);

  alerts.forEach(async alert => {
    const user = await User.findOne({
      where: {
        id: alert.user_id,
      },
    });
    send(
      '/app/assets/template/template-account-confirmation.ejs',
      {
        firstname: user.firstname,
        lastname: user.lastname,
        link: 'http://localhost:5173',
      },
      user.email,
      `Nouveau produit '${category.name}'`,
    );
  });
};

const alertProductStock = async product_id => {
  try {
  } catch (err) {}
  const alerts = await Alert.findAll({
    where: {
      alert_type_id: 'dff2e704-2268-44b3-82fa-e90766750f87',
    },
  });

  const product = await Product.findByPk(product_id);

  alerts.forEach(async alert => {
    const user = await User.findOne({
      where: {
        id: alert.user_id,
      },
    });
    send(
      '/app/assets/template/template-account-confirmation.ejs',
      {
        firstname: user.firstname,
        lastname: user.lastname,
        link: 'http://localhost:5173',
      },
      user.email,
      `Restock d'un produit '${product.title}'`,
    );
  });
};

module.exports = {
  alertNewProduct,
  alertProductStock,
};
