const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.String,
      required: true,
    },
    products: [
      {
        stock_id: {
          type: Schema.Types.String,
          required: true,
        },
        quantity: {
          type: Schema.Types.Number,
          required: true,
        },
      },
    ],
    cart_step: {
      type: Schema.Types.Number,
      default: 1,
    },
  },
  { timestamps: true },
).index({}, { partialFilterExpression: { products: { $eq: [] } } }); // remove empty products array

module.exports = mongoose.model('Cart', cartSchema);
