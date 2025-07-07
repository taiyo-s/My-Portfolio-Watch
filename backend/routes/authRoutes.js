const router = require("express").Router();
const auth = require("../controllers/authController");

router.post(process.env.POST_SIGNUP, auth.signup);
router.post(process.env.POST_LOGIN, auth.login);
router.get(process.env.GET_TOKEN, auth.verifyToken);

module.exports = router;