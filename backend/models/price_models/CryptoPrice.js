const mongoose = require("mongoose");
const { assetPricesConnection } = require("../../config/database"); 

const CryptoPriceSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rank: { type: Number, required: true }, // by mkt cap
    last_updated: { type: Date, default: Date.now }
});

CryptoPriceSchema.index({ symbol: "text", name: "text" });

module.exports = assetPricesConnection.model("CryptoPrice", CryptoPriceSchema);