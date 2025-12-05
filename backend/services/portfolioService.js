/**
 * Service for recalculating and updating user portfolio values.
 * Handles both crypto and stock holdings and updates value history.
 */

const Crypto = require("../models/user_models/Crypto");
const CryptoPrice = require("../models/price_models/CryptoPrice");
const Stock = require("../models/user_models/Stock");
const StockPrice = require("../models/price_models/StockPrice");

async function recalculateUserPortfolio(user, { isCron = false } = {}) {
    if (!user) return user;

    let cryptoValue = 0;
    let stockValue = 0;

    // --- Crypto holdings ---
    const cryptoHoldings = user.cryptoCollection?.cryptoCollection || [];

    for (const holding of cryptoHoldings) {
        const cryptoAsset = await CryptoPrice.findOne({ symbol: holding.symbol.toUpperCase() });
        if (!cryptoAsset) continue;

        const newPrice = cryptoAsset.price;
        const newValue = holding.amount * newPrice;

        await Crypto.findByIdAndUpdate(holding._id, {
            currentUnitPrice: newPrice,
            currentValue: newValue
        });

        cryptoValue += newValue;
    }

    // --- Stock holdings ---
    const stockHoldings = user.stockCollection?.stockCollection || [];

    for (const holding of stockHoldings) {
        const stockAsset = await StockPrice.findOne({ ticker: holding.ticker });
        if (!stockAsset) continue;

        const newPrice = stockAsset.price;
        const newValue = holding.amount * newPrice;

        await Stock.findByIdAndUpdate(holding._id, {
            currentUnitPrice: newPrice,
            currentValue: newValue
        });

        stockValue += newValue;
    }

    // --- Update user portfolio ---
    const totalValue = stockValue + cryptoValue;
    user.overallValue = totalValue;

    if (isCron) {
        user.valueHistory.push(totalValue);
        user.updatedAt.push(new Date());
    } else {
        if (user.valueHistory.length == 0) {
            user.valueHistory.push(totalValue);
        }
        if (user.updatedAt.length == 0) {
            user.updatedAt.push(new Date());
        } 
    }

    await user.save();

    return user;
}

module.exports = { recalculateUserPortfolio };