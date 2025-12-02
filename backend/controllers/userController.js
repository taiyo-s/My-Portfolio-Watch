/**
 * Handles user data retrieval and portfolio recalculation.
 * Uses User model and portfolioService for up-to-date portfolio info.
 */

const User = require("../models/user_models/User");
const { recalculateUserPortfolio } = require("../services/portfolioService");

exports.getUserData = async (req, res) => {
    try{
        let user = await User.findById(req.userId).populate({
            path: 'cryptoCollection',
            populate: {
                path: 'cryptoCollection',
                model: 'Crypto',
            },
        });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        user = await recalculateUserPortfolio(user);

        res.json({
            success: true,
            name: user.name,
            portfolioValue: user.overallValue,
            valueHistory: user.valueHistory,
            updatedAt: user.updatedAt
        });
    } catch (err) {
        console.error("Error in getUserData:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};