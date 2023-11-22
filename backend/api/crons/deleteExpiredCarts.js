const Cart = require('../models/nosql/cart');
const Stock = require('../models/sql/stock');
const cron = require('node-cron');

async function deleteExpiredCarts() {
  const expirationTime = 15 * 60 * 1000; // 15 minutes
  const currentTimestamp = Date.now();

  try {
    // Récupération des paniers expirés ou vides
    const paniersExpires = await Cart.find({
      $or: [
        { createdAt: { $lt: currentTimestamp - expirationTime } },
        { products: { $size: 0 } },
      ],
    });

    for (const panier of paniersExpires) {
      for (const product of panier.products) {
        // Restauration de la quantité dans PostgreSQL
        const stock = await Stock.findOne({ where: { id: product.stock_id } });
        if (stock) {
          await stock.update({ quantity: stock.quantity + product.quantity });
        } else {
          console.warn('Stock not found for product:', product.stock_id);
        }
      }

      // Suppression du panier expiré de MongoDB
      await Cart.deleteOne({ _id: panier._id });
    }
  } catch (error) {
    console.error(error);
  }
}

cron.schedule('*/1 * * * *', deleteExpiredCarts); // toutes les minutes

module.exports = deleteExpiredCarts;
