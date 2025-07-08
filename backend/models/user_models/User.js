const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    overallValue: { type: Number },
    startValue: { type: Number },
    valueHistory: [{ type: Number }],
    updatedAt: [{ type: Date }],
    lastVisit: { type: Date },
    stockCollection: { type: Schema.Types.ObjectId, ref: 'StockCollection' },
    cryptoCollection: { type: Schema.Types.ObjectId, ref: 'CryptoCollection' },
    cs2SkinCollection: { type: Schema.Types.ObjectId, ref: 'CS2SkinCollection' },
});

module.exports = userConn.model("User", userSchema);