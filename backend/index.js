const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const RedisStore = require('connect-redis').default;
const redis = require("redis");
const jwt = require("jsonwebtoken");
require('dotenv').config({path: '.env'});
const User = require("./models/User");
const StockCollectionSchema = require('./models/StockCollection');
const CryptoCollectionSchema = require('./models/CryptoCollection');
const CS2SkinCollectionSchema = require('./models/CS2SkinCollection');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}));

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true, 
        rejectUnauthorized: false,
    }
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});
redisClient.connect().catch(console.error);

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 30 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
    }
}));

const { connectToDatabase } = require("./config/database");
connectToDatabase();

// Put after the route of a get/post etc, method 
const checkSession = (req, res, next) => {
    if (!req.session.token) {
        return res.status(401).send('Session expired. Please log in again.');
    }
    next();
};

const authenticate = (req, res, next) => {
    const token = req.session.token;
    console.log(token);
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Token expired or invalid' });
        }
    }
    else {
        res.status(401).send('Not authenticated');
    }
};

app.get(process.env.GET_BY_USERNAME, authenticate, async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });

        if (user) {
            res.json({ success: true, name: user.name, 
                portfolioValue: user.overallValue, updatedDates: user.updatedDates});
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
        const initialValues = [0];
        const dates = [new Date()];
        const now = new Date();
        const newStocks = await StockCollectionSchema.create({});
        const newCryptos = await CryptoCollectionSchema.create({});
        const newCS2Skins = await CS2SkinCollectionSchema.create({});
        const newUser = await User.create({ name, username, password: hash, 
            overallValue: initialValues, updatedDates: dates, lastVisit: now,
            stockCollection: newStocks._id, cryptoCollection: newCryptos._id, 
            cs2SkinCollection: newCS2Skins._id});

        const token = jwt.sign({ id: newUser._id }, 
            process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        
        res.json({ message: "Success", username: newUser.username });
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
            const token = jwt.sign({ id: user._id }, 
                process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(token);
            req.session.token = token;
            const now = new Date();
            user.lastVisit = now;
            await user.save();
            res.json({ message: "Success", username });
        } else {
            res.json("Incorrect username or password");
        }
    } catch (error) {
        res.json(error.message);
    }
});

app.get(process.env.GET_SESSION, (req, res) => {
    const token = req.session.token;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.json({ isAuthenticated: true });
        } catch (err) {
            return res.json({ isAuthenticated: false });
        }
    }
    res.json({ isAuthenticated: false });
});
  
app.post(process.env.POST_LOGOUT, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.json('Logged out');
    });
});

async function reload() {
    try {
        const response = await axios.get(process.env.BACKEND_URL);
        console.log('Reloaded')
    } catch (error) {
        console.error('Error', error);
    }
}

setInterval(reload, 10 * 60 * 1000) // 10 mins

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});