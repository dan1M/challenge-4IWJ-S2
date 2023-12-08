const Alert = require('../models/sql/alert');
const User = require('../models/sql/user');
const Category = require('../models/sql/category');
const ProductMongo = require('../models/nosql/product');

const { send } = require('./mailer');

const alertNewProduct = async product => {
  try {
    const alerts = await Alert.findAll({
      where: {
        label: 'new-product',
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
        './assets/template/template-account-confirmation.ejs',
        {
          firstname: user.firstname,
          lastname: user.lastname,
          link: 'http://localhost:5173',
        },
        user.email,
        `Nouveau produit de la catégorie '${category.name}': ${product.title}`,
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const alertProductStock = async product_id => {
  try {
    const alerts = await Alert.findAll({
      where: {
        label: 'restock-product',
      },
    });

    const product = await ProductMongo.findById(product_id);

    alerts.forEach(async alert => {
      const user = await User.findOne({
        where: {
          id: alert.user_id,
        },
      });
      send(
        './assets/template/template-alert-restock-product.ejs',
        {
          firstname: user.firstname,
          lastname: user.lastname,
          link: 'http://localhost:5173',
        },
        user.email,
        `Restock d'un produit '${product.title}'`,
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const alertPriceChange = async product_id => {
  try {
    const alerts = await Alert.findAll({
      where: {
        label: 'price-change',
      },
    });

    const product = await ProductMongo.findById(product_id);

    alerts.forEach(async alert => {
      const user = await User.findOne({
        where: {
          id: alert.user_id,
        },
      });
      send(
        './assets/template/template-account-confirmation.ejs',
        {
          firstname: user.firstname,
          lastname: user.lastname,
          link: 'http://localhost:5173',
        },
        user.email,
        `Changement de prix pour le produit: '${product.title}'`,
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const alertNewsletter = async user => {
  try {
    send(
      './assets/template/template-newsletter.ejs',
      {
        firstname: user.firstname,
        lastname: user.lastname,
        link: 'http://localhost:5173',
      },
      user.email,
      `Inscription à la newsletter`,
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  alertNewProduct,
  alertProductStock,
  alertPriceChange,
  alertNewsletter,
};
