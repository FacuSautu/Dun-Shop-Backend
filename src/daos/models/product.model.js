import mongoose from 'mongoose';

const productCollection = 'products';

const productScheme = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: [String],
    code: String,
    stock: Number
})

export const productModel = mongoose.model(productCollection, productScheme);