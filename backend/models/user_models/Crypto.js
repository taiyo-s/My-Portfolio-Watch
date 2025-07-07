const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});
  
module.exports = mongoose.model('Crypto', cryptoSchema);