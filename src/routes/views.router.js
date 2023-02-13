import { Router } from 'express';

import { __dirname } from '../utils.js';
import ProductManager from '../daos/ProductManager.js';
import ProductDB from '../daos/product.db.js';
import MessageDB from '../daos/message.db.js';

const viewsRouter = Router();

// Instancias de clases.
const messageDB = new MessageDB();

// Vista principal.
viewsRouter.get('/', async (req, res)=>{
    try {
        res.redirect('/realtimeproducts');
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status: 'error', message: error.message});
    }
})

// Visualizacion de productos.
viewsRouter.get('/products', async (req, res)=>{
    try {
        // Query params
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || '';
        const sort = req.query.sort || 1;

        // Obtencion de producto
        const productsRes = await fetch(`http://localhost:8080/api/products?limit=${limit}&page=${page}&query=${query}&sort=${sort}`);
        const products = await productsRes.json();

        // Agregado de objeto de paginacion
        products.pagination = {
            active: true,
            prevLink: (products.hasPrevPage) ? `http://localhost:8080/products?limit=${limit}&page=${products.prevPage}` : '#',
            pagesLinks: [],
            nextLink: (products.hasNextPage) ? `http://localhost:8080/products?limit=${limit}&page=${products.nextPage}` : '#'
        };

        // Calculo de cantidad de paginas a mostrar.
        let numLinkPages = (products.totalPages > 5) ? 5 : products.totalPages;
        let midPageDif = 1;

        // Armado de paginas
        for (let i = 1; i <= numLinkPages; i++) {
            let actualPage;                                     // Numero de la pagina a mostrar.
            let middleCicle = Math.ceil(numLinkPages/2);        // Numero medio del ciclo.
            let middlePage = products.page;                     // Numero de la pagina media.

            // Cambio del ciclo medio segun posicion de la pagina a presentar como activa.
            if(products.page < middleCicle){
                middleCicle = products.page;
            }else if(products.page > (products.totalPages-middleCicle)){
                middleCicle = numLinkPages-(products.totalPages-products.page);
            }

            // Seteo de pagina a mostrar dependiendo de si se encuentra a los lados de la pagina media.
            if(i < middleCicle){
                actualPage = (middlePage-middleCicle)+midPageDif;
                midPageDif++;
            }else if(i === middleCicle){
                actualPage = middlePage;
                midPageDif=1;
            }else{
                actualPage = middlePage+midPageDif;
                midPageDif++;
            }

            // Armado del objeto pageLink.
            let pageLink = {
                page:actualPage,
                link:`http://localhost:8080/products?limit=${limit}&page=${actualPage}`,
                active: products.page === actualPage
            }

            products.pagination.pagesLinks.push(pageLink);
        }

        // Se muestra la paginacion?
        if(products.totalPages <= 1) products.pagination.active = false;

        res.render('products', {products: products});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', error: error.message});
    }
})

// Visualizacion en detalle de un producto.
viewsRouter.get('/products/:pid', async (req, res)=>{
    try {
        const productId = req.params.pid;

        const productRes = await fetch(`http://localhost:8080/api/products/${productId}`);
        let product = await productRes.json();

        product.payload.thumbnails = product.payload.thumbnails.map(thumbnail => (thumbnail.match(/^img/i)) ? '../'+thumbnail : thumbnail);

        res.render('productDetail', {product:product.payload});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', error: error.message});
    }
})

// Visualizacion de productos en tiempo real.
viewsRouter.get('/realtimeproducts', async (req, res)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || '';
        const sort = req.query.sort || 1;
    
        const productsRes = await fetch(`http://localhost:8080/api/products?limit=${limit}&page=${page}&query=${query}&sort=${sort}`);
        const products = await productsRes.json();
    
        res.render('realTimeProducts', {products:products.payload});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status: 'error', message: error.message});
    }

})

// Visualizacion de carrito.
viewsRouter.get('/carts/:cid', async (req, res)=>{
    try {
        const cartId = req.params.cid;

        const cartRes = await fetch(`http://localhost:8080/api/carts/${cartId}`);
        let cart = await cartRes.json();

        
        cart.payload.map(prod=>{
            prod.totalPrice = (prod.product.price*prod.quantity).toFixed(2);
            
            return prod;
        })

        res.render('cart', {cart, cartId});
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status:'error', error: error.message});
    }
})

// Visualizacion del chat.
viewsRouter.get('/chat', async (req, res)=>{
    let messages = await messageDB.getMessages();

    res.render('chat', {messages});
})

export default viewsRouter;