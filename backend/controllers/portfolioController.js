/**
 * Handles portfolio operations such as adding assets and retrieving crypto holdings.
 * Interacts with user, crypto, and collection models.
 */

const User = require('../models/user_models/User');
const Crypto = require('../models/user_models/Crypto');
const CryptoCollection = require('../models/user_models/CryptoCollection');
const CryptoPrice = require('../models/price_models/CryptoPrice');

exports.addAssetToPortfolio = async (req, res) => {
    try {
        const { type, assetId, amount, price } = req.body;

        const userId = req.userId;

        const user = await User.findById(userId).populate('cryptoCollection');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (type === 'crypto') {
            // Get asset from CryptoPrice
            const cryptoAsset = await CryptoPrice.findById(assetId);
            if (!cryptoAsset) {
                return res.status(404).json({ error: 'Crypto asset not found' });
            }
            // If no cryptoCollection, create one and link to user
            let collection = user.cryptoCollection;
            if (!collection) {
                collection = new CryptoCollection();
                await collection.save();
                user.cryptoCollection = collection._id;
                await user.save();
            }

            // Create new Crypto holding
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

            // Push into collection
            collection.cryptoCollection.push(cryptoHolding._id);
            await collection.save();

            return res.json({ success: true, asset: cryptoHolding });
        }

    } catch (err) {
        console.error('Add asset error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

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