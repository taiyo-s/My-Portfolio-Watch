/**
 * Mongoose model for storing a user's collection of crypto holdings.
 * Uses userConn for database access and references Crypto documents.
 */

const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cryptoCollectionSchema = new Schema({
    cryptoCollection: [{ type: Schema.Types.ObjectId, ref: 'Crypto' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = userConn.model('CryptoCollection', cryptoCollectionSchema);