const router = require("express").Router();
const {
  sendPayment,
  getTransactions
} = require("../controllers/paymentController");

router.post("/send", sendPayment);
router.get("/", getTransactions);

module.exports = router;
