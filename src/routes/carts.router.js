import { Router } from "express";

import __dirname from '../utils.js';
import CartManager from "../daos/CartManager.js";
import CartDB from "../daos/cart.db.js";

const cartsRouter = Router();

// Instancias de clases.
const cartManager = new CartManager(__dirname+'/fs_persistance/carts.json');
const cartDB = new CartDB();

// Muestra los datos de un carrito.
cartsRouter.get('/:cid', async (req, res)=>{
    try {
        
        let cartId = req.params.cid;
        let cartToShow = await cartDB.getCartById(cartId);
        
        if(!!cartToShow){
            res.send({status:'success', payload:cartToShow.products});
        }else{
            res.status(404).send({status:'error', message:`No se encontro carrito con el ID ${cartId}`});
        }
    } catch (error) {
        res.status(404).send({status:'error', message: error.message});
    }
})

// Agrega un nuevo carrito.
cartsRouter.post('/', (req, res)=>{
    try {
        let newCart = req.body;
    
        cartDB.addCart(newCart);
        console.log(newCart);
        res.send({status:'success', message: 'El carrito fue agregado con exito'});
    } catch (error) {
        res.status(404).send({status:'error', message: error.message});
    }
})

// Agrega un producto al carrito indicado.
cartsRouter.post('/:cid/product/:pid', (req, res)=>{
    let productId = req.params.pid;
    let cartId = req.params.cid;

    cartDB.addProductToCart(cartId, productId);

    res.send({status: 'success', message: `Producto ${productId} cargado con exito al carrito ${cartId}`});
})

export default cartsRouter;