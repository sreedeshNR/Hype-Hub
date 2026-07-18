const express = require('express');
const router = express.Router();
const productController = require('../../controllers/user/productController');

router.get('/shop', productController.getShopPage);

router.get('/product/:slug', productController.getProductDetailsPage);

module.exports = router;