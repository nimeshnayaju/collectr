const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);