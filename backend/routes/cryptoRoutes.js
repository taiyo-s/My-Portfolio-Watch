const router = require("express").Router();
const cryptoCtl = require("../controllers/cryptoController");

router.get(process.env.CRYPTO_SEARCH, cryptoCtl.search);   

module.exports = router;