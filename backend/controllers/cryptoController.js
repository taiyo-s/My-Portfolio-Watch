/**
 * Handles crypto search API endpoint.
 * Uses CryptoPrice model to find and return matching cryptocurrencies.
 */

const CryptoPrice = require("../models/price_models/CryptoPrice");

/**
 * GET /api/crypto/search?q=abc
 * Returns up to 50 cryptos whose symbol or name contains the query string.
 */
exports.search = async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(400).json({ message: "Missing q parameter" });

        const regex = new RegExp(q, "i"); // case-insensitive
        const docs = await CryptoPrice
            .find({ $or: [{ symbol: regex }, { name: regex }] })
            .limit(50);

        res.json(docs);
    } catch (err) {
        next(err);
    }
};