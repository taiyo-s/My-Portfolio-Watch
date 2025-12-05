/**
 * Handles portfolio operations such as adding assets and retrieving holdings.
 * Interacts with user, crypto, stock and collection models.
 */

const cryptoPortfolio = require('./cryptoPortfolioController');
const stockPortfolio = require('./stockPortfolioController');

exports.addAsset = async (req, res, next) => {
    if (req.body.type === 'crypto') return cryptoPortfolio.addAssetToPortfolio(req, res, next);
    if (req.body.type === 'stock') return stockPortfolio.addStockToPortfolio(req, res, next);
    return res.status(400).json({ error: 'Invalid type' });
};

exports.getHoldings = async (req, res, next) => {
    const { type } = req.body; 
    if (type === 'crypto') return cryptoPortfolio.getCryptoHoldings(req, res, next);
    if (type === 'stock') return stockPortfolio.getStockHoldings(req, res, next);
    return res.status(400).json({ error: 'Invalid type' });
};