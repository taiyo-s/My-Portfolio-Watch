const { userConn } = require('../../config/database'); 
const { Schema } = require('mongoose');

const cs2SkinCollectionSchema = new Schema({
    skinCollection: [{ type: Schema.Types.ObjectId, ref: 'CS2Skin' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = userConn.model('CS2SkinCollection', cs2SkinCollectionSchema);