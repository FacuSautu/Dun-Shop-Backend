import mongoose from 'mongoose';
import cartModel from './models/cart.model.js';

class CartDbDAO{

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

  async getCartById(id, populated=false){
    await this.exists(id);

    return (populated) ? cartModel.findById(id).populate('products.product').lean() : cartModel.findById(id).lean();
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
  
  async updateProductInCart(cartId, productToUpdate, qty){
    await this.exists(cartId);

    if(!await this.hasProduct(cartId, productToUpdate)) throw new Error(`No existe el producto ${productToUpdate} dentro del carrito ${cartId}`);

    let cart = await this.getCartById(cartId);
    let product = cart.products.find(prod=>prod.product == productToUpdate);
    let productIndex = cart.products.indexOf(product);

    cart.products[productIndex].quantity = qty;

    return cartModel.updateOne({_id: cartId}, {products: cart.products})

  }

  async deleteProductFromCart(cartId, productToDelete){
    await this.exists(cartId);

    let cart = await this.getCartById(cartId);

    let productExist = cart.products.find(prod => prod.product._id == productToDelete);

    if(!!!productExist) throw new Error(`No existe el producto ${productToDelete} en el carrito ${cartId}`);
    
    let productIndex = cart.products.indexOf(productExist);

    cart.products.splice(productIndex, 1);

    return cartModel.updateOne({_id:cartId}, {products:cart.products});
  }

  async deleteAllProductFromCart(cartId){
    await this.exists(cartId);

    return cartModel.updateOne({_id:cartId}, {products:[]});
  }
}

export default CartDbDAO;
