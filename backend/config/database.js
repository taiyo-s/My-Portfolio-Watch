const mongoose = require("mongoose");
require("dotenv").config();

const userConn = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: "User-data",
});
const assetPricesConnection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: "Asset-prices",
});

userConn.once("open",  () => console.log("User-data connected"));
assetPricesConnection.once("open", () => console.log("Asset-prices connected"));

module.exports = { userConn, assetPricesConnection };