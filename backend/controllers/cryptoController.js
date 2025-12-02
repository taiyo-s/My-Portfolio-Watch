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

        let docs;
        // If query is ≥2 chars, prefer text search (faster, ranked)
        if (q.length >= 2) {
        docs = await CryptoPrice
            .find({ $text: { $search: q } },
                { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" }, rank: 1 })
            .limit(50);
        } else {
        // Tiny query → fallback to case-insensitive regex
        const regex = new RegExp(q, "i");
        docs = await CryptoPrice
            .find({ $or: [{ symbol: regex }, { name: regex }] })
            .sort({ rank: 1 })
            .limit(50);
        }

        res.json(docs);
    } catch (err) {
        next(err);
    }
};