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
        res.redirect('/products');
    } catch (error) {
        console.log(error.message);
        res.status(404).send({status: 'error', message: error.message});
    }
})

// Listado de productos.
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
            prevLink: (products.hasPrevPage) ? `http://localhost:8080/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : '#',
            pagesLinks: [],
            nextLink: (products.hasNextPage) ? `http://localhost:8080/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : '#'
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
                link:`http://localhost:8080/products?limit=${limit}&page=${actualPage}&sort=${sort}&query=${query}`,
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

// Detalle de producto.
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

// Listado productos en tiempo real.
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

// Detalle del carrito.
viewsRouter.get('/carts/:cid', privateView, async (req, res)=>{
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

// Formulario de registro.
viewsRouter.get('/register', publicView, (req, res)=>{
    res.render('register');
})

// Formulario de login.
viewsRouter.get('/login', publicView, (req, res)=>{
    const validation = Number(req.query.validation);
    const isLogout = Number(req.query.logout);
    const isRegister = Number(req.query.register);
    let message = '';

    switch (validation) {
        case 0:
            message = 'No se encontro usuario con esas credenciales. Por favor vuelva a intentar.';
            break;
        case 1:
            message = 'Solo usuarios registrados pueden acceder a esta pagina, por favor inicie sesi??n.';
            break;
    }

    if(!!isRegister) message = 'Registro exitoso, por favor inicie sesi??n para comenzar.';    
    if(!!isLogout) message = 'Por favor inicie sesi??n nuevamente para poder utilizar la totalidad de funciones.';
    
    res.render('login', {message});
})

// Vista de perfil de usuario.
viewsRouter.get('/profile', privateView, (req, res)=>{
    res.render('profile');
})

// Chat.
viewsRouter.get('/chat', privateView, async (req, res)=>{
    let messages = await messageDB.getMessages();

    res.render('chat', {messages});
})


// Views custom middlewares.
function privateView(req, res, next){       // Middleware de validacion de rutas privadas.
    if(!!!req.session.user) return res.redirect('/login?validation=1');

    next();
}

function publicView(req, res, next){       // Middleware de validacion de rutas publicas.
    if(!!req.session.user) return res.redirect('/profile');

    next();
}

export default viewsRouter;