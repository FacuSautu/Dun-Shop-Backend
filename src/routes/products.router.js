import { Router } from "express";

import { uploader } from '../utils.js';
import ProductController from "../controllers/products.controller.js";

const productsRouter = Router();

// Instancias de clases.
const productController = new ProductController();

// Lista todos los productos.
productsRouter.get('/', async (req, res)=>{
    try {
        const limit = req.query.limit;
        const page = req.query.page;
        const query = req.query.query;
        const sort = req.query.sort;

        const products = await productController.getProducts(limit, page, query, sort);
    
        res.send({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status: 'error', message: error.message});
    }
})

// Muestra los datos de un solo producto.
productsRouter.get('/:pid', async (req, res)=>{
    try {
        const pid = req.params.pid;
        
        let product = await productController.getProduct(pid);
    
        res.send({status:'success', payload:product});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Agrega un nuevo producto.
productsRouter.post('/', uploader.array('thumbnails'), async (req, res)=>{
    try {
        let product = req.body;
        
        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        let addedProduct = await productController.addProduct(product);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto cargado exitosamente. ID: ${addedProduct._id}`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Modifica un producto.
productsRouter.put('/:pid', uploader.array('thumbnails'), async (req, res)=>{
    try {
        let productId = req.params.pid;
        let product = req.body;

        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        await productController.updateProduct(productId, product);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto modificado exitosamente. ID: ${productId}`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Elimina un producto.
productsRouter.delete('/:pid', async (req, res)=>{
    try {
        let productId = req.params.pid;
        
        await productController.deleteProduct(productId);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto eliminado exitosamente. ID: ${productId}`});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'Error', message: error.message});
    }
})


// Funciones
async function broadcastProducts(sockets){
    let products = await productController.getProducts();
    sockets.emit('products_update', products);
}

export default productsRouter;