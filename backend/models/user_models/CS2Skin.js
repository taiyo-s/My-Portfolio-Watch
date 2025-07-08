const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cs2SkinSchema = new Schema({
    skinName: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseUnitPrice: { type: Number, required: true },
    currentUnitPrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
});

module.exports = userConn.model('CS2Skin', cs2SkinSchema);