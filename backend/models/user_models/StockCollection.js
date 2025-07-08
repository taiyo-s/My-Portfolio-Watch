const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const stockCollectionSchema = new Schema({
    stockCollection: [{ type: Schema.Types.ObjectId, ref: 'Stock' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = userConn.model('StockCollection', stockCollectionSchema);