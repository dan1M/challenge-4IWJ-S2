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
        price: {
          type: Schema.Types.Number,
          required: true,
        },
        name: {
          type: Schema.Types.String,
          required: true,
        },
        img: {
          type: Schema.Types.String,
        },
        color: {
          type: Schema.Types.String,
          required: true,
        },
        size: {
          type: Schema.Types.String,
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
);

module.exports = mongoose.model('Cart', cartSchema);
