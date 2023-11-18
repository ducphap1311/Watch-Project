const express = require("express");
const router = express.Router();
const {
    getProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    updateProduct,
} = require("../controllers/Product");

router.route("/products").get(getProducts).post(createProduct);
router
    .route("/products/:id")
    .get(getSingleProduct)
    .delete(deleteProduct)
    .put(updateProduct);
module.exports = router;
