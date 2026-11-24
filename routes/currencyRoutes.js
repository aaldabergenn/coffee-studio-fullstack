const router = require("express").Router();
const auth = require("../middleware/auth");
const { convert } = require("../controllers/currencyController");

router.get("/convert", auth, convert);

module.exports = router;
