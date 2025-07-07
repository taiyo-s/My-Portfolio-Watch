const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cs2SkinSchema = new Schema({
    skinName: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});

module.exports = mongoose.model('CS2Skin', cs2SkinSchema);