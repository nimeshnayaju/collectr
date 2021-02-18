const mongoose = require('mongoose');

var RecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date },
    manufacturer: { type: String }
});

module.exports = mongoose.model("Record", RecordSchema);

