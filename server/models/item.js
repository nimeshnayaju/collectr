const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date },
    manufacturer: { type: String },
    isPrivate: { type: Boolean, required: true },
    user: { type: mongoose.schema.Types.ObjectId, ref:'User', required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
