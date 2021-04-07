const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
}, { strict: false });

module.exports = mongoose.model('Item', ItemSchema);
