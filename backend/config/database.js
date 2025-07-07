const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        // Connect to the User-data database (Main User Database)
        const userConnection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "User-data",
        });
        console.log("Connected to User-data Database");

        // Create a separate connection for asset prices
        const assetPricesConnection = mongoose.createConnection(process.env.MONGO_URI, {
            dbName: "Asset_prices",
        });
        console.log("Connected to Asset Prices Database");

        return { userConnection, assetPricesConnection };
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = { connectToDatabase };