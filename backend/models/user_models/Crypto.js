/**
 * Mongoose model for storing individual user crypto holdings.
 * Uses userConn for database access.
 */

const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cryptoSchema = new Schema({
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});
  
module.exports = userConn.model('Crypto', cryptoSchema);