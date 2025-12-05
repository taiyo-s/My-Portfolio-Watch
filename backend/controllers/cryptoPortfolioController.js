/**
 * Handles crypto portfolio operations: adding assets and retrieving holdings.
 * Fully separated from any stock logic.
 */

const User = require('../models/user_models/User');
const Crypto = require('../models/user_models/Crypto');
const CryptoCollection = require('../models/user_models/CryptoCollection');
const CryptoPrice = require('../models/price_models/CryptoPrice');

/**
 * Add a crypto asset to a user's portfolio
 */
exports.addAssetToPortfolio = async (req, res) => {
    try {
        const { assetId, amount, price } = req.body; // type is handled by delegator
        const userId = req.userId;

        // Fetch user with populated collection
        const user = await User.findById(userId).populate('cryptoCollection');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Fetch crypto asset from CryptoPrice
        const cryptoAsset = await CryptoPrice.findById(assetId);
        if (!cryptoAsset) return res.status(404).json({ error: 'Crypto asset not found' });

        // Ensure the user has a crypto collection
        let collection = user.cryptoCollection;
        if (!collection) {
            collection = new CryptoCollection();
            await collection.save();
            user.cryptoCollection = collection._id;
            await user.save();
        }

        // Create new crypto holding
        const currentUnitPrice = cryptoAsset.price;
        const currentValue = amount * currentUnitPrice;

        const cryptoHolding = new Crypto({
            symbol: cryptoAsset.symbol,
            amount,
            purchaseUnitPrice: price,
            currentUnitPrice,
            currentValue,
        });

        await cryptoHolding.save();

        // Add to user's collection
        collection.cryptoCollection.push(cryptoHolding._id);
        await collection.save();

        return res.json({ success: true, asset: cryptoHolding });

    } catch (err) {
        console.error('Add crypto asset error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get all crypto holdings for a user
 */
exports.getCryptoHoldings = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'cryptoCollection',
            populate: {
                path: 'cryptoCollection',
                model: 'Crypto',
            },
        });

        if (!user || !user.cryptoCollection) {
            return res.json({ success: true, holdings: [] });
        }

        const holdings = user.cryptoCollection.cryptoCollection || [];
        return res.json({ success: true, holdings });

    } catch (err) {
        console.error('Fetch crypto holdings error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};