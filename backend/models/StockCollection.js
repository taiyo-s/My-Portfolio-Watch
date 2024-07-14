const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockCollectionSchema = new Schema({
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stockCollection: [{ type: Schema.Types.ObjectId, ref: 'Stock' }],
    overallValue: { type: Number, default: 0}
});

module.exports = mongoose.model('StockCollection', stockCollectionSchema);