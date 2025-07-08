const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cryptoCollectionSchema = new Schema({
    cryptoCollection: [{ type: Schema.Types.ObjectId, ref: 'Crypto' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = userConn.model('CryptoCollection', cryptoCollectionSchema);