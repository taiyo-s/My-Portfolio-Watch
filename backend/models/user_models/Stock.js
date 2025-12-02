/**
 * Mongoose model for storing individual user stock holdings.
 * Uses userConn for database access.
 */

const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const stockSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});

module.exports = userConn.model('Stock', stockSchema);