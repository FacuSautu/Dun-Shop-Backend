import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productScheme = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price:Number,
    status:Boolean,
    stock:Number,
    category:String,
    thumbnails:{
        type: [String],
        default: ['img/default_product_img.png']
    }
})

productScheme.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productScheme);

export default productModel;