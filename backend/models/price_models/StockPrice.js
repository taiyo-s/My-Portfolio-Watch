const mongoose = require("mongoose");
const { assetPricesConnection } = require("../../config/database");

const StockPriceSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    ticker: { type: String, requred: true, unique: true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now }
})

schema.index({ ticker: "text", name: "text" });

module.exports = assetPricesConnection.model("StockPrice", StockPriceSchema);