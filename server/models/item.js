const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date },
    manufacturer: { type: String }
});

module.exports = mongoose.model('Item', ItemSchema);
