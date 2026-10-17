import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    totalprice: {
        type: Number
    },

})

export const cartModel = mongoose.model('cart', cartSchema)