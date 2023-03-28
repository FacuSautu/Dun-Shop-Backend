import { __dirname } from "../utils.js";
import CartManager from "../daos/CartManager.js";
import CartDB from "../daos/cart.db.js";
import config from "../config/config.js";

class CartService{
    constructor(){
        const cartManager = new CartManager(__dirname+'/fs_persistance/carts.json');
        const cartDB = new CartDB();

        this.persistanceEngine = config.persistance_engine.toUpperCase() === 'DB' ? cartDB : cartManager;
    }

    getCart(id, populated=true){
        return this.persistanceEngine.getCartById(id, populated);
    }

    addCart(cart){
        return this.persistanceEngine.addCart(cart);
    }

    addProductToCart(cartId, productId){
        return this.persistanceEngine.addProductToCart(cartId, productId);
    }

    updateCart(id, products){
        return this.persistanceEngine.updateCart(id, products);
    }

    updateProdQty(cartId, productId, qty){
        return this.persistanceEngine.updateProductInCart(cartId, productId, qty);
    }

    deleteProduct(cartId, productId){
        return this.persistanceEngine.deleteProductFromCart(cartId, productId);
    }

    deleteAllProducts(cartId){
        return this.persistanceEngine.deleteAllProductFromCart(cartId);
    }
}

export default CartService;