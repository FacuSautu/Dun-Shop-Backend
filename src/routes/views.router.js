import { Router } from 'express';

import __dirname from '../utils.js';
import ProductManager from '../controllers/ProductManager.js';

const viewsRouter = Router();
const productManager = new ProductManager(__dirname+'/db/products.json');

viewsRouter.get('/', async (req, res)=>{
    let products = await productManager.getProducts();

    res.render('home', {products});
})

viewsRouter.get('/realtimeproducts', async (req, res)=>{
    let products = await productManager.getProducts();

    req.io.on('connection', socket=>{
        console.log("Cliente conectado.");
    })

    res.render('realTimeProducts', {products});
})

export default viewsRouter;