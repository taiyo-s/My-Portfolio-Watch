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

        let docs;

        if (q.length >= 2) {
            // Use text search if query is ≥2 characters
            docs = await StockPrice
                .find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .limit(50);
        } else {
            // Fallback to regex for tiny queries (<2 chars)
            const regex = new RegExp(q, "i");
            docs = await StockPrice
                .find({ $or: [{ ticker: regex }, { name: regex }] })
                .limit(50);
        }

        res.json(docs);

    } catch (err) {
        next(err);
    }
};