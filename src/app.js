import express from 'express';
import __dirname from './utils.js';

import ProductManager from './models/ProductManager.js';

const productManager = new ProductManager(__dirname+'/persistence/products.json');

const app = express();

app.use(express.urlencoded({extended:true}));

app.get('/products', async (req, res)=>{
    try {
        const products = await productManager.getProducts();
        
        const offset = req.query.offset || 0;
        const limit = req.query.limit || products.length;
    
        res.json(products.splice(offset, limit));
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'Error', error: error.message});
    }
})

app.get('/products/:pid', async (req, res)=>{
    try {
        const pid = Number(req.params.pid);
        let product = await productManager.getProductById(pid);

        res.json(product);
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'Error', error: error.message});
    }
})

app.listen(8080, ()=>{
    console.log("Server live on http://localhost:8080/");
})