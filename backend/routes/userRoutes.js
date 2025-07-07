const router = require("express").Router();
const authMw = require("../middleware/auth");
const user = require("../controllers/userController");

router.get(process.env.GET_USER_DATA, authMw, user.getUserData);
module.exports = router;