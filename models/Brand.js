const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

    },
    {timestamps : true}
);


module.exports = mongoose.model("Brand", brandSchema)