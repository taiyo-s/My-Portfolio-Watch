const mongoose = require('mongoose');
// require('dotenv').config({ path: '../.env' });

// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log("MongoDB connected succesfully");
// })
// .catch(err => {
//     console.error('MongoDB connection error:', err);
// });

//const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    overallValue: { type: Number, default: 0 },
    // stocks: [{ type: Schema.Types.ObjectId, ref: 'Stock' }],
    // cryptos: [{ type: Schema.Types.ObjectId, ref: 'Crypto' }],
    // cs2Skins: [{ type: Schema.Types.ObjectId, ref: 'CS2Skin' }],
});

module.exports = mongoose.model("User", userSchema);