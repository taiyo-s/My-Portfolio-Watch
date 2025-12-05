/**
 * Handles stock search API endpoint.
 * Uses StockPrice model to find and return matching stocks.
 */

const StockPrice = require("../models/price_models/StockPrice");

/**
 * GET /api/stocks/search?q=abc
 * Returns up to 50 stocks whose ticker or name contains the query string.
 */
exports.search = async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(400).json({ message: "Missing q parameter" });

        const regex = new RegExp(q, "i"); // case-insensitive
        const docs = await StockPrice
            .find({ $or: [{ ticker: regex }, { name: regex }] })
            .limit(50);

        res.json(docs);
    } catch (err) {
        next(err);
    }
};