const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "User-data" });
        console.log("MongoDB connected successfully");
    } 
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = { connectToDatabase };