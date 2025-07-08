const User = require("../models/user_models/User");

exports.getUserData = async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
        success: true,
        name: user.name,
        portfolioValue: user.overallValue,
        valueHistory: user.valueHistory,
        updatedAt: user.updatedAt
    });
};