/**
 * Express router for stock-related endpoints.
 * Supports stock search.
 */

const router = require("express").Router();
const authMw = require("../middleware/auth");
const stockCtl = require("../controllers/stockController");

// Search stocks by symbol or name
router.get(process.env.STOCK_SEARCH, authMw, stockCtl.search);

module.exports = router;