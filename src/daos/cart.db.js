import mongoose from 'mongoose';
import cartModel from './models/cart.model.js';

class CartDB{

  constructor(){}

  async exists(cartId){
    if(!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('El valor enviado no corresponde a un ID valido');

    let exist = await cartModel.exists({_id:cartId});
    
    if(!!!exist) throw new Error(`No existe carrito con el ID ${cartId}.`);

    return true;
  }

  async hasProduct(cartId, productId){
    let cart = await this.getCartById(cartId);

    return cart.products.some(prod => prod.product._id == productId);
  }

  async getCarts(){
    return await cartModel.find();
  }

  async getCartById(id){
    await this.exists(id);

    return cartModel.findById(id);
  }

  async addCart(cartToAdd){
    return cartModel.create(cartToAdd);
  }

  async updateCart(cartId, products){
    await this.exists(cartId);

    return cartModel.updateOne({_id:cartId}, {products});
  }

  async addProductToCart(cartId, productToAdd){
    await this.exists(cartId);

    let cart = await this.getCartById(cartId);

    let productExist = cart.products.find(prod => {
      console.log(prod.product._id);
      return prod.product._id == productToAdd
    });

    if(!!productExist){
      let productIndex = cart.products.indexOf(productExist);

      cart.products[productIndex].quantity++;
    }else{
      cart.products.push({product: productToAdd, quantity:1})
    }

    return cartModel.updateOne({_id:cartId}, {products:cart.products});
  }
  
}

export default CartDB;
