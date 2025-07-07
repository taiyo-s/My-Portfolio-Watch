const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});

module.exports = mongoose.model('Stock', stockSchema);