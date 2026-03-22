const router = require("express").Router();
const {
  addProduct,
  getProducts,
  deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", addProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
