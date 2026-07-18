const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
    size: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    }
}, { _id: false }); 

const variantSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        salePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        sizes: [sizeSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);