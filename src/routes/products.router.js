import { Router } from "express";

import { handlePolicies, uploader } from '../utils.js';
import ProductController from "../controllers/products.controller.js";

const productsRouter = Router();

// Instancias de clases.
const productController = new ProductController();

// Lista todos los productos.
productsRouter.get('/', async (req, res, next)=>{
    try {
        const limit = req.query.limit;
        const page = req.query.page;
        const query = req.query.query;
        const sort = req.query.sort;

        const products = await productController.getProducts(limit, page, query, sort);

        res.send({
            status: 'success',
            payload: products.products,
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
        next(error);
    }
})

// Muestra los datos de un solo producto.
productsRouter.get('/:pid', async (req, res, next)=>{
    try {
        const pid = req.params.pid;
        
        let product = await productController.getProduct(pid);
    
        res.send({status:'success', payload:product});
    } catch (error) {
        next(error);
    }
})

// Agrega un nuevo producto.
productsRouter.post('/', handlePolicies(['ADMIN', 'PREMIUM']), uploader.array('thumbnails'), async (req, res, next)=>{
    try {
        let product = req.body;
        
        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        let addedProduct = await productController.addProduct(product);
        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto cargado exitosamente. ID: ${addedProduct?.id || addedProduct?._id}`});
    } catch (error) {
        next(error);
    }
})

// Modifica un producto.
productsRouter.put('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), uploader.array('thumbnails'), async (req, res, next)=>{
    try {
        let productId = req.params.pid;
        let product = req.body;

        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        await productController.updateProduct(productId, product, req.user);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto modificado exitosamente. ID: ${productId}`});
    } catch (error) {
        next(error);
    }
})

// Elimina un producto.
productsRouter.delete('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), async (req, res, next)=>{
    try {
        let productId = req.params.pid;
        
        await productController.deleteProduct(productId, req.user);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:`Producto eliminado exitosamente. ID: ${productId}`});
    } catch (error) {
        next(error);
    }
})


// Funciones
async function broadcastProducts(sockets){
    let products = await productController.getProducts();
    sockets.emit('products_update', products);
}

export default productsRouter;