import { __dirname } from "../utils.js";
// import CartFsDAO from "../daos/cart.fs.dao.js";
// import CartDbDAO from "../daos/cart.db.dao.js";
// import config from "../config/config.js";
import { CartsFty } from '../daos/factory.js';

class CartService{
    constructor(){
        // const cartManager = new CartFsDAO(__dirname+'/fs_persistance/carts.json');
        // const cartDB = new CartDbDAO();

        // this.persistanceEngine = config.persistance_engine.toUpperCase() === 'MONGO' ? cartDB : cartManager;

        this.persistanceEngine = new CartsFty();
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