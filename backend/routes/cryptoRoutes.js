const router = require("express").Router();
const cryptoCtl = require("../controllers/cryptoController");

router.get("/crypto/search", cryptoCtl.search);   

module.exports = router;