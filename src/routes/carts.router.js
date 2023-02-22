import { Router } from "express";

import { __dirname } from '../utils.js';
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
        let cartToShow = await cartDB.getCartById(cartId, true);
        
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
cartsRouter.post('/', async (req, res)=>{
    try {
        let newCart = req.body;
    
        const addedCart = await cartDB.addCart(newCart);
        
        res.send({status:'success', message: `El carrito fue agregado con exito. ID del carrito: ${addedCart._id}`});
    } catch (error) {
        res.status(404).send({status:'error', message: error.message});
    }
})

// Agrega un producto al carrito indicado.
cartsRouter.post('/:cid/product/:pid', async (req, res)=>{
    try {
        let productId = req.params.pid;
        let cartId = req.params.cid;
    
        await cartDB.addProductToCart(cartId, productId);
    
        res.send({status: 'success', message: `Producto ${productId} cargado con exito al carrito ${cartId}`});
    } catch (error) {
        res.status(404).send({status:'error', message: error.message});
    }
})

// Modificar el array de productos de un carrito.
cartsRouter.put('/:cid', async (req, res)=>{
    try {
        const cartId = req.params.cid;
        const { products } = req.body;

        await cartDB.updateCart(cartId, products);

        res.send({status: 'success', message: `El carrito ${cartId} se modifico con exito`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Modifica la cantidad de un producto en un carrito.
cartsRouter.put('/:cid/product/:pid', async (req, res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
    
        await cartDB.updateProductInCart(cartId, productId, quantity);
    
        res.send({status: 'success', message: `Se modifico la cantidad del producto ${productId} por ${quantity} dentro del carrito ${cartId}.`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Eliminar un producto de un carrito.
cartsRouter.delete('/:cid/product/:pid', async (req, res)=>{
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;
    
        await cartDB.deleteProductFromCart(cartId, productId);

        res.send({status: 'success', message: `Producto ${productId} eliminado con exito del carrito ${cartId}`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Eliminar todos los productos de un carrito.
cartsRouter.delete('/:cid', async (req, res)=>{
    try {
        let cartId = req.params.cid;
    
        await cartDB.deleteAllProductFromCart(cartId);

        res.send({statis: 'success', message: `Se eliminaron todos los productos del carrito ${cartId}`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})


export default cartsRouter;