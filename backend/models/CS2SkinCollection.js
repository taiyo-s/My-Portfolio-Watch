const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cs2SkinCollectionSchema = new Schema({
    skinCollection: [{ type: Schema.Types.ObjectId, ref: 'CS2Skin' }],
    past24Hours: [{ type: Number }],
    startValue: { type: Number },
});

module.exports = mongoose.model('CS2SkinCollection', cs2SkinCollectionSchema);