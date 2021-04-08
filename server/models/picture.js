const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    image: {data: Buffer, contentType: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}
})

module.exports = mongoose.model('Picture', PictureSchema);