const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
require('dotenv').config({path: '.env'});
const User = require("./models/User");
const StockCollectionSchema = require('./models/StockCollection');
const CryptoCollectionSchema = require('./models/CryptoCollection');
const CS2SkinCollectionSchema = require('./models/CS2SkinCollection');

const app = express();
app.use(express.json());
app.use(cors());

const { connectToDatabase } = require("./config/database");

// Connect to the database
connectToDatabase();

// Signup route
app.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json("User already exists");
        }

        const saltRounds = 3;
        const hash = await bcrypt.hash(password, saltRounds);
        const newStocks = await StockCollectionSchema.create({});
        const newCryptos = await CryptoCollectionSchema.create({});
        const newCS2Skins = await CS2SkinCollectionSchema.create({});
        const newUser = await User.create({ name, username, password: hash, 
            stockCollection: newStocks._id, cryptoCollection: newCryptos._id, 
            cs2SkinCollection: newCS2Skins._id});

        res.json({ message: "Success", username: newUser.username });
    } catch (error) {
        res.json(error.message);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json("User does not exist");
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.json({ message: "Success", username });
        } else {
            res.json("Incorrect password");
        }
    } catch (error) {
        res.json(error.message);
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});