const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorSchema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Color', colorSchema);
