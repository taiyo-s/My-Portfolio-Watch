const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockCollectionSchema = new Schema({
    stockCollection: [{ type: Schema.Types.ObjectId, ref: 'Stock' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = mongoose.model('StockCollection', stockCollectionSchema);