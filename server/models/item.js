const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    condition: { type: String },
    provenance: { type: String },
    date: { type: String },
    isPrivate: { type: Boolean, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }
}, { strict: false });

module.exports = mongoose.model('Item', ItemSchema);
