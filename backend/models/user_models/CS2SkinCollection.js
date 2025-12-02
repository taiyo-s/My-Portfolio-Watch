/**
 * Mongoose model for storing a user's collection of CS2 skin holdings.
 * Uses userConn for database access and references CS2Skin documents.
 */

const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cs2SkinCollectionSchema = new Schema({
    skinCollection: [{ type: Schema.Types.ObjectId, ref: 'CS2Skin' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = userConn.model('CS2SkinCollection', cs2SkinCollectionSchema);