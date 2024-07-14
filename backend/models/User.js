const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    overallValue: { type: Number, default: 0 },
    stockCollection: { type: Schema.Types.ObjectId, ref: 'StockCollection' },
    cryptoCollection: { type: Schema.Types.ObjectId, ref: 'CryptoCollection' },
    cs2SkinCollection: { type: Schema.Types.ObjectId, ref: 'CS2SkinCollection' },
});

module.exports = mongoose.model("User", userSchema);