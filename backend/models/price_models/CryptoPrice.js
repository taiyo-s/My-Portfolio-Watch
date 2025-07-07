const mongoose = require("mongoose");
const { assetPricesConnection } = require("../../config/database"); 

const CryptoPriceSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now }
});

schema.index({ symbol: "text", name: "text" });

module.exports = assetPricesConnection.model("CryptoPrice", CryptoPriceSchema);