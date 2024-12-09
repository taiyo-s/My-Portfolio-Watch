const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cron = require('node-cron');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require('dotenv').config({path: '.env'});
const User = require("./models/User");
const StockCollectionSchema = require('./models/StockCollection');
const CryptoCollectionSchema = require('./models/CryptoCollection');
const CS2SkinCollectionSchema = require('./models/CS2SkinCollection');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}));

const { connectToDatabase } = require("./config/database");
connectToDatabase();

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId; 
            next(); 
        } catch (err) {
            res.status(403).json({ message: 'Token expired or invalid' });
        }
    }
    else {
        res.status(401).send('Not authenticated');
    }
}

app.get(process.env.GET_TOKEN, (req, res) => {
    const token = req.headers['authorization']; 
    if (token && token.startsWith('Bearer ')) {
        const jwtToken = token.split(' ')[1]; 
        try {
            jwt.verify(jwtToken, process.env.JWT_SECRET);
            return res.json({ isAuthenticated: true });
        } catch (err) {
            return res.json({ isAuthenticated: false });
        }
    }
    res.json({ isAuthenticated: false });
});

app.get(process.env.GET_USER_DATA, authenticateToken, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId)
        if (user) {
            res.json({ success: true, name: user.name, 
                portfolioValue: user.overallValue, valueHistory: user.valueHistory,
                updatedAt: user.updatedAt});
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup route
app.post(process.env.POST_SIGNUP, async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json("Username is already taken");
        }

        const saltRounds = 3;
        const hash = await bcrypt.hash(password, saltRounds);
        const initialValue = 0;
        const startValue = 0;
        const valueHistory = [0];
        const dates = [new Date()];
        const now = new Date();
        const newStocks = await StockCollectionSchema.create({});
        const newCryptos = await CryptoCollectionSchema.create({});
        const newCS2Skins = await CS2SkinCollectionSchema.create({});
        const newUser = await User.create({ name, username, password: hash, 
            overallValue: initialValue, startValue: startValue, valueHistory: valueHistory, 
            updatedAt: dates, lastVisit: now, stockCollection: newStocks._id, 
            cryptoCollection: newCryptos._id, cs2SkinCollection: newCS2Skins._id});

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, 
            { expiresIn: '15m' });
        console.log(username + " signed up");
        res.json({ token: token, message: "Success" });
    } catch (error) {
        res.json(error.message);
    }
});

// Login route
app.post(process.env.POST_LOGIN, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json("Incorrect username or password");
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, 
                { expiresIn: '15m' });
            const now = new Date();
            user.lastVisit = now;
            await user.save();
            console.log(username + " logged in");
            res.json({ token: token, message: "Success" });
        } else {
            res.json("Incorrect username or password");
        }
    } catch (error) {
        res.json(error.message);
    }
});

cron.schedule('0 */2 * * *', () => {
    console.log('cron job');
});

app.head(process.env.PING, (req, res) => {
    console.log('Server is up and running');
    res.status(200).end();
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});