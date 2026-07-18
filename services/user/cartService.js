const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const Variant = require('../../models/Variant');

const MAX_QTY_PER_ITEM = 5; 

const getCart = async (userId) => {
    let cart = await Cart.findOne({ userId }).populate({
        path: 'items.productId',
        select: 'productName slug isListed isDeleted'
    }).lean();

    if (!cart) return { items: [], cartTotal: 0 };

    let validItems = [];
    let cartTotal = 0;

    for (let item of cart.items) {
        if (!item.productId || !item.productId.isListed || item.productId.isDeleted) {
            item.isDisabled = true;
            item.errorMsg = "Product is currently unavailable";
        } else {
            const variant = await Variant.findById(item.variantId).lean();
            if (variant) {
                const activePrice = variant.salePrice > 0 ? variant.salePrice : variant.regularPrice;
                const sizeData = variant.sizes.find(s => s.size === item.size);
                
                if (!sizeData || sizeData.quantity < item.quantity) {
                    item.isDisabled = true;
                    item.errorMsg = "Out of stock or insufficient quantity";
                } else {
                    item.isDisabled = false;
                    item.price = activePrice;
                    item.image = variant.images[0];
                    item.color = variant.color;
                    item.maxStock = sizeData.quantity; // To restrict incrementing
                    cartTotal += (activePrice * item.quantity);
                }
            }
        }
        validItems.push(item);
    }

    cart.items = validItems;
    cart.cartTotal = cartTotal;
    return cart;
};

const addToCart = async (userId, productId, variantId, size) => {
    const product = await Product.findById(productId).lean();
    if (!product || !product.isListed || product.isDeleted) {
        throw { status: 400, message: "This product is unavailable." };
    }

    const variant = await Variant.findById(variantId).lean();
    const sizeInfo = variant.sizes.find(s => s.size === Number(size));
    if (!sizeInfo || sizeInfo.quantity < 1) {
        throw { status: 400, message: "Selected size is out of stock." };
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId && 
                item.variantId.toString() === variantId && 
                item.size === Number(size)
    );

    if (existingItemIndex > -1) {
        let currentQty = cart.items[existingItemIndex].quantity;
        
        if (currentQty >= MAX_QTY_PER_ITEM) {
            throw { status: 400, message: `Maximum limit of ${MAX_QTY_PER_ITEM} reached for this item.` };
        }
        if (currentQty >= sizeInfo.quantity) {
            throw { status: 400, message: "Not enough stock available." };
        }
        
        cart.items[existingItemIndex].quantity += 1;
    } else {
        cart.items.push({ productId, variantId, size: Number(size), quantity: 1 });
    }

    await cart.save();

    return true;
};

const updateQuantity = async (userId, itemId, action) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw { status: 404, message: "Cart not found" };

    const item = cart.items.id(itemId);
    if (!item) throw { status: 404, message: "Item not found in cart" };

    const variant = await Variant.findById(item.variantId).lean();
    const sizeInfo = variant.sizes.find(s => s.size === item.size);
    const availableStock = sizeInfo ? sizeInfo.quantity : 0;

    if (action === 'increment') {
        if (item.quantity >= MAX_QTY_PER_ITEM) {
            throw { status: 400, message: `Maximum limit of ${MAX_QTY_PER_ITEM} reached.` };
        }
        if (item.quantity >= availableStock) {
            throw { status: 400, message: "No more stock available." };
        }
        item.quantity += 1;
    } else if (action === 'decrement') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            throw { status: 400, message: "Quantity cannot be less than 1." };
        }
    }

    await cart.save();
    return true;
};

const removeItem = async (userId, itemId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) return false;

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    return true;
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeItem
};