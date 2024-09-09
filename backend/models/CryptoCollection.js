const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoCollectionSchema = new Schema({
    cryptoCollection: [{ type: Schema.Types.ObjectId, ref: 'Crypto' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = mongoose.model('CryptoCollection', cryptoCollectionSchema);