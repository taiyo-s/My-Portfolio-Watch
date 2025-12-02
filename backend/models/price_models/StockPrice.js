/**
 * Mongoose model for storing stock price data.
 * Uses assetPricesConnection and supports text search on ticker and name.
 */

const mongoose = require("mongoose");
const { assetPricesConnection } = require("../../config/database");

const StockPriceSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    ticker: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    exchange: { type: String },
    currency: { type: String }, 
    last_updated: { type: Date, default: Date.now }
})

StockPriceSchema.index({ ticker: "text", name: "text" });

module.exports = assetPricesConnection.model("StockPrice", StockPriceSchema);