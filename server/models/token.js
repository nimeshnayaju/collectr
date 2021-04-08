const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Token', tokenSchema);