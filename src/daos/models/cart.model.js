import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartScheme = mongoose.Schema({
    products: [{
            product: Number,
            quantity: Number
        }]
})

const cartModel = mongoose.model(cartCollection, cartScheme);

export default cartModel;