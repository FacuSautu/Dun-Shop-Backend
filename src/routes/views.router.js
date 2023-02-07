import { Router } from 'express';

import { __dirname } from '../utils.js';
import ProductManager from '../daos/ProductManager.js';
import ProductDB from '../daos/product.db.js';
import MessageDB from '../daos/message.db.js';

const viewsRouter = Router();

// Instancias de clases.
const productManager = new ProductManager(__dirname+'/fs_persistance/products.json');
const productDB = new ProductDB();
const messageDB = new MessageDB();

viewsRouter.get('/', async (req, res)=>{
    let products = await productDB.getProducts().lean();

    products.map(prod=>{
        prod.hasImgs = prod.thumbnails.length>0;
        return prod;
    })

    res.render('home', {products});
})

viewsRouter.get('/realtimeproducts', async (req, res)=>{
    let products = await productDB.getProducts().lean();

    products.map(prod=>{
        prod.hasImgs = prod.thumbnails.length>0;
        return prod;
    })

    res.render('realTimeProducts', {products});
})

viewsRouter.get('/chat', async (req, res)=>{
    let messages = await messageDB.getMessages().lean();

    res.render('chat', {messages});
})

export default viewsRouter;