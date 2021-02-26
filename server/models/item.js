const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },
  manufacturer: { type: String },
  catalog: { type:  mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true } // Reference to the associated Collection object
});

module.exports = mongoose.model('Item', ItemSchema);
