/**
 * Mongoose model for storing extra stock tickers not in the S&P 500.
 * Uses assetPricesConnection for database access.
 */

const mongoose = require("mongoose");
const { assetPricesConnection } = require("../../config/database");

const ExtraStockSchema = new mongoose.Schema({
    _id: { type: String, required: true },   // the ticker symbol, e.g. "LUNR"
    ticker: { type: String }, 
    name: { type: String },   
});

module.exports = assetPricesConnection.model("ExtraStock", ExtraStockSchema);
