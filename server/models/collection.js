const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
})

module.exports = mongoose.model('Collection', CollectionSchema);