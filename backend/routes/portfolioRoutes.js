const router = require("express").Router();
const authMw = require("../middleware/auth");
const portfolioCtl = require("../controllers/portfolioController");

router.post(process.env.ASSET_ADD, authMw, portfolioCtl.addAssetToPortfolio);
router.get(process.env.CRYPTO_HOLDINGS, authMw, portfolioCtl.getCryptoHoldings);

module.exports = router;