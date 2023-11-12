const Product = require('../models/sql/product.js');
const ProductMongo = require('../models/nosql/product.js');
const Stock = require('../models/sql/stock.js');
const Category = require('../models/sql/category');
const Size = require('../models/sql/size.js');
const Color = require('../models/sql/color.js');


async function updateOrCreateMongoProduct(productId) {
    try {
      const product = await Product.findByPk(productId);
      const findCategory = await Category.findByPk(product.category_id);
      const productVariants = await Stock.findAll({ where: { product_id: productId } });
      const variants = [];
  
      for (const productVariant of productVariants) {
        const size = await Size.findByPk(productVariant.size_id);
        const color = await Color.findByPk(productVariant.color_id);
        variants.push({
          quantity: productVariant.quantity,
          price: productVariant.price,
          size: {
            id: size.id,
            name: size.name,
          },
          color: {
            id: color.id,
            name: color.name,
          },
        });
      }
  
      const existingProduct = await ProductMongo.findById(productId);
  
      if (existingProduct) {
        // Update existing product document in MongoDB
        existingProduct.set({
          title: product.title,
          description: product.description,
          category: {
            id: findCategory.id,
            name: findCategory.name,
          },
          variants: variants,
        });
        await existingProduct.save();
      } else {
        // Insert new product document in MongoDB
        await ProductMongo.create({
          _id: product.id,
          title: product.title,
          description: product.description,
          category: {
            id: findCategory.id,
            name: findCategory.name,
          },
          variants: variants,
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error while updating MongoDB product:", error);
    }
  }

  module.exports = {updateOrCreateMongoProduct}
  