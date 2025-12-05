/**
 * Express router for portfolio asset and holdings endpoints.
 * Uses auth middleware and connects to portfolioController methods.
 */

const router = require("express").Router();
const authMw = require("../middleware/auth");
const portfolioCtl = require("../controllers/portfolioController");

// Add asset (crypto or stock) to portfolio
router.post(process.env.ASSET_ADD, authMw, portfolioCtl.addAsset);

// Get holdings for a specific type (crypto or stock)
router.get(process.env.GET_HOLDINGS, authMw, portfolioCtl.getHoldings);

module.exports = router;