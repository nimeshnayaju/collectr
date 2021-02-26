const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  manufacturer: { type: String },
  collection: { type:  mongoose.Schema.Types.ObjectId, ref: 'Collection' }
});

module.exports = mongoose.model('Item', ItemSchema);
