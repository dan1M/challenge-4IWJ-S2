const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
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
    status: {
      type: Schema.Types.String,
      default: 'created',
    },
    payment_id: {
      type: Schema.Types.String,
    },
    tracking_id: {
      type: Schema.Types.String,
    },
    tracking_url: {
      type: Schema.Types.String,
    },
    parcel_id: {
      type: Schema.Types.Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
