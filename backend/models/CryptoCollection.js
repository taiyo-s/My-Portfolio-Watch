const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoCollectionSchema = new Schema({
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cryptoCollection: [{ type: Schema.Types.ObjectId, ref: 'Crypto' }],
    overallValue: { type: Number, default: 0}
});

module.exports = mongoose.model('CryptoCollection', cryptoCollectionSchema);