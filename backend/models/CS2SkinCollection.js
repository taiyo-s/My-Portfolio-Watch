const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cs2SkinCollectionSchema = new Schema({
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skinCollection: [{ type: Schema.Types.ObjectId, ref: 'CS2Skin' }],
    overallValue: [{ type: Number }]
});

module.exports = mongoose.model('CS2SkinCollection', cs2SkinCollectionSchema);