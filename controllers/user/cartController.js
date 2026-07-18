const cartService = require('../../services/user/cartService');

const getCartPage = async (req, res, next) => {
    try {
        const userId = req.session.user._id; 
        const cartData = await cartService.getCart(userId);

        res.render('user/cart', {
            title: 'Your Cart - HypeHub',
            user: req.session.user,
            cart: cartData.items,
            cartTotal: cartData.cartTotal
        });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const { productId, variantId, selectedSize } = req.body;

        await cartService.addToCart(userId, productId, variantId, selectedSize);
        
        req.flash('success', 'Product added to cart!');
        res.redirect('/cart');
    } catch (error) {
        req.flash('error', error.message || 'Could not add to cart.');
        res.redirect('back');
    }
};

const updateQuantity = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { itemId, action } = req.body; 

        await cartService.updateQuantity(userId, itemId, action);
        res.status(200).json({ success: true, message: "Quantity updated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const removeItem = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const itemId = req.params.itemId;

        await cartService.removeItem(userId, itemId);
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCartPage,
    addToCart,
    updateQuantity,
    removeItem
};