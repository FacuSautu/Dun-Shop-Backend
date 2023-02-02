import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartsScheme = mongoose.Schema({
    products: [{
            product: Number,
            quantity: Number
        }]
})

export const cartsModel = mongoose.model(cartCollection, cartsScheme);