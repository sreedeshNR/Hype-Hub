const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
            max: 5 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);