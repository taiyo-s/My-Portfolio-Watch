const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_models/User");
const StockCollection = require("../models/user_models/StockCollection");
const CryptoCollection = require("../models/user_models/CryptoCollection");
const CS2SkinCollection = require("../models/user_models/CS2SkinCollection");

exports.signup = async (req, res) => {
    const { name, username, password } = req.body;

    if (await User.findOne({ username })) {
        return res.json("Username is already taken")
    };

    const hash = await bcrypt.hash(password, 3);
    const newStocks = await StockCollection.create({});
    const newCryptos = await CryptoCollection.create({});
    const newCS2Skins = await CS2SkinCollection.create({});

    const user = await User.create({
        name, username, password: hash,
        overallValue: 0, startValue: 0, valueHistory: [0], updatedAt: [new Date()],
        lastVisit: new Date().toISOString().split("T")[0],
        stockCollection: newStocks._id,
        cryptoCollection: newCryptos._id,
        cs2SkinCollection: newCS2Skins._id
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, 
        { expiresIn: "15m" });
    console.log(username + " signed up");
    res.json({ token, message: "Success" });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.json("Incorrect username or password");

    user.lastVisit = new Date().toISOString().split("T")[0];
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, 
        { expiresIn: "15m" });
    console.log(username + " logged in");
    res.json({ token, message: "Success" });
};

exports.verifyToken = (_, res) => res.json({ isAuthenticated: true });