const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    isPrivate: {type: Boolean, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    itemFields: [{ type: String }]
});

module.exports = mongoose.model('Catalog', CatalogSchema);
