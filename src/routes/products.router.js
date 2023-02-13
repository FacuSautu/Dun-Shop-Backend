import { Router } from "express";

import { __dirname, uploader } from '../utils.js';
import ProductManager from '../daos/ProductManager.js';
import ProductDB from '../daos/product.db.js';

const productsRouter = Router();

// Instancias de clases.
const productManager = new ProductManager(__dirname+'/fs_persistance/products.json');
const productDB = new ProductDB();

// Lista todos los productos.
productsRouter.get('/', async (req, res)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query;
        const sort = req.query.sort;

        const products = await productDB.getProducts(limit, page, query, sort);
    
        res.send({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage && `localhost:8080/api/products?limit=${limit}&page=${products.prevPage}`,
            nextLink: products.hasNextPage && `localhost:8080/api/products?limit=${limit}&page=${products.nextPage}`
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
        let product = await productDB.getProductById(pid);
    
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
        
        if(!!!product.thumbnails) product.thumbnails = [];

        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        await productDB.addProduct(product);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:'Producto cargado exitosamente.'});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Modifica un producto.
productsRouter.put('/:dip', uploader.array('thumbnails'), async (req, res)=>{
    try {
        let productId = req.params.dip;
        let product = req.body;

        if(!!!product.thumbnails) product.thumbnails = [];

        if(!!req.files){
            req.files.forEach(file => product.thumbnails.push('img/'+file.filename));
        }

        await productDB.updateProduct(productId, product);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:'Producto modificado exitosamente.'});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', message: error.message});
    }
})

// Elimina un producto.
productsRouter.delete('/:pid', async (req, res)=>{
    try {
        let productId = req.params.pid;
        
        await productDB.deleteProduct(productId);

        await broadcastProducts(req.io.sockets);

        res.send({status:'success', message:'Producto eliminado exitosamente.'});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'Error', message: error.message});
    }
})


// Funciones
async function broadcastProducts(sockets){
    let products = await productDB.getProducts();
    sockets.emit('products_update', products);
}

export default productsRouter;