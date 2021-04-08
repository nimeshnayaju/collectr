const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
<<<<<<< HEAD
    startDate: { type: Date },
    endDate: { type: Date },
    manufacturer: { type: String },
    condition: { type: String },
    provenance: { type: String },
    description: { type: String }
});
=======
    description: { type: String },
}, { strict: false });
>>>>>>> main

module.exports = mongoose.model('Item', ItemSchema);
