const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Catalog', CatalogSchema);
