const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/cartController');
const { isLogin, checkBlocked } = require('../../middlewares/authMiddleware'); // Adjust path to your middleware


router.get('/cart',isLogin,checkBlocked, cartController.getCartPage);
router.post('/cart/add',isLogin, checkBlocked, cartController.addToCart);
router.post('/cart/update-quantity',isLogin, checkBlocked, cartController.updateQuantity); // For AJAX
router.get('/cart/remove/:itemId',isLogin, checkBlocked, cartController.removeItem);

module.exports = router;