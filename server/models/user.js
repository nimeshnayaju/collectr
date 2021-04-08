const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    }
})

module.exports = mongoose.model('User', UserSchema);