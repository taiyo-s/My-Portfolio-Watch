/**
 * Handles stock portfolio operations: adding stocks and retrieving holdings.
 * Fully separated from any crypto logic.
 */

const User = require('../models/user_models/User');
const Stock = require('../models/user_models/Stock');
const StockCollection = require('../models/user_models/StockCollection');
const StockPrice = require('../models/price_models/StockPrice');

/**
 * Add a stock to a user's portfolio
 */
exports.addStockToPortfolio = async (req, res) => {
    try {
        const { assetId, amount, price } = req.body; // assetId = StockPrice._id
        const userId = req.userId;

        // Fetch user with populated stock collection
        const user = await User.findById(userId).populate('stockCollection');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Fetch stock asset by _id
        const stockAsset = await StockPrice.findById(assetId);
        if (!stockAsset) return res.status(404).json({ error: 'Stock not found' });

        // Ensure the user has a stock collection
        let collection = user.stockCollection;
        if (!collection) {
            collection = new StockCollection();
            await collection.save();
            user.stockCollection = collection._id;
            await user.save();
        }

        // Create new stock holding
        const currentUnitPrice = stockAsset.price;
        const currentValue = amount * currentUnitPrice;

        const stockHolding = new Stock({
            ticker: stockAsset._id, // use _id as ticker
            amount,
            purchaseUnitPrice: price,
            currentUnitPrice,
            currentValue
        });

        await stockHolding.save();

        // Add to user's stock collection
        collection.stockCollection.push(stockHolding._id); // match schema field
        await collection.save();

        return res.json({ success: true, asset: stockHolding });

    } catch (err) {
        console.error('Add stock error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get all stock holdings for a user
 */
exports.getStockHoldings = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'stockCollection',
            populate: {
                path: 'stockCollection', // matches schema field name
                model: 'Stock'
            }
        });

        if (!user || !user.stockCollection) {
            return res.json({ success: true, holdings: [] });
        }

        const holdings = user.stockCollection.stockCollection || []; // match schema field
        return res.json({ success: true, holdings });

    } catch (err) {
        console.error('Fetch stock holdings error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};