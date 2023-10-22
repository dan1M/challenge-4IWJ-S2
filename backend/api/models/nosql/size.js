const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Size', sizeSchema);
