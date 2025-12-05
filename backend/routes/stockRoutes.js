/**
 * Express router for stock-related endpoints.
 * Supports stock search.
 */

const router = require("express").Router();
const stockCtl = require("../controllers/stockController");

// Search stocks by symbol or name
router.get(process.env.STOCK_SEARCH, stockCtl.search);

module.exports = router;