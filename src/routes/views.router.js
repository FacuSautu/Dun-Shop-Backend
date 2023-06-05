import { Router } from 'express';
import fs from 'fs';

import ProductController from '../controllers/products.controller.js';
import CartController from '../controllers/carts.controller.js';
import UserController from '../controllers/users.controller.js';
import MessageDbDAO from '../daos/message.db.dao.js';
import { __dirname, handlePolicies } from '../utils.js';
import config from '../config/config.js';


const viewsRouter = Router();

// Instancias de clases.
const productController = new ProductController();
const cartController = new CartController();
const userController = new UserController();
const messageDB = new MessageDbDAO();

// Vista principal.
viewsRouter.get('/', async (req, res, next)=>{
    try {
        res.status(301).redirect('/products');
    } catch (error) {
        next(error);
    }
})

// Listado de productos.
viewsRouter.get('/products', async (req, res, next)=>{
    try {
        // Query params
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || '';
        const sort = req.query.sort || 1;

        // Obtencion de producto
        const products = await productController.getProducts({limit, page, query, sort});

        products.payload = products.products;

        // Agregado de objeto de paginacion
        products.pagination = {
            active: true,
            prevLink: products.prevLink,
            pagesLinks: [],
            nextLink: products.nextLink
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
                link:`/products?limit=${limit}&page=${actualPage}&sort=${sort}&query=${query}`,
                active: products.page === actualPage
            }

            products.pagination.pagesLinks.push(pageLink);
        }

        // Se muestra la paginacion?
        if(products.totalPages <= 1) products.pagination.active = false;

        res.render('products/products', {products});
    } catch (error) {
        next(error);
    }
})

// Tabla ABM producto.
viewsRouter.get('/products/abm', privateView, handlePolicies(["ADMIN", "PREMIUM"]), async (req, res, next)=>{
    try {
        let query = {};
        if(req.session.user.rol.toUpperCase() == "PREMIUM") query = {owner: req.session.user._id};

        const products = await productController.getProducts({query: JSON.stringify(query)});
        
        res.render('products/productsTable', {products});
    } catch (error) {
        next(error);
    }
})

// Formulario de producto.
viewsRouter.get('/products/abm/:opt', privateView, handlePolicies(["ADMIN", "PREMIUM"]), async (req, res, next)=>{
    try {
        const opt = req.params.opt;
        const pid = req.query.pid;
        let product;

        if(!!pid){
            product = await productController.getProduct(pid);

            product.thumbnails = product.thumbnails.map(thumbnail => (thumbnail.match(/^img/i)) ? '../'+thumbnail : thumbnail);    
        }

        res.render('products/productForm', {product, opt});
    } catch (error) {
        next(error);
    }
})

// Detalle de producto.
viewsRouter.get('/products/:pid', privateView, async (req, res, next)=>{
    try {
        const productId = req.params.pid;

        let product = await productController.getProduct(productId);

        product.thumbnails = product.thumbnails.map(thumbnail => (thumbnail.match(/^img/i)) ? '../'+thumbnail : thumbnail);

        let isOwner = (String(product.owner) === String(req.user._id)) || (req.user.rol.toUpperCase() === 'ADMIN');

        res.render('products/productDetail', {product, isOwner});
    } catch (error) {
        next(error);
    }
})

// Listado productos en tiempo real.
viewsRouter.get('/realtimeproducts', async (req, res, next)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || '';
        const sort = req.query.sort || 1;
    
        const products = await productController.getProducts({limit, page, query, sort});

        res.render('products/realTimeProducts', {products:products.products});
    } catch (error) {
        next(error);
    }

})

// Detalle del carrito.
viewsRouter.get('/carts/:cid', privateView, async (req, res, next)=>{
    try {
        const cartId = req.params.cid;

        let cart = await cartController.getCart(cartId);

        cart.products.map(prod=>{
            prod.totalPrice = (prod.product.price*prod.quantity).toFixed(2);
            
            return prod;
        })

        res.render('carts/cart', {cart, cartId});
    } catch (error) {
        next(error);
    }
})

// Formulario de registro.
viewsRouter.get('/register', publicView, (req, res)=>{
    const validation = Number(req.query.validation);
    let message = '';

    switch(validation){
        case 0:
            message = "Surgio un error al registrar al usuario, por favor intentelo denuevo.";
        case 1:
            message = "Ya existe un usuario asociado a ese e-mail, por favor inicie sesion.";
    }

    res.render('sessions/register', {message});
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
            message = 'Solo usuarios registrados pueden acceder a esta pagina, por favor inicie sesión.';
            break;
        case 2:
            message = 'La contraseña ingresada es incorrecta. Por favor vuelva a intentar.';
            break;
        case 3:
            message = 'Contraseña restablecida exitosamente. Por favor inicie sesión.'
            break;
    }

    if(!!isRegister) message = 'Registro exitoso, por favor inicie sesión para comenzar.';    
    if(!!isLogout) message = 'Por favor inicie sesión nuevamente para poder utilizar la totalidad de funciones.';
    
    res.render('sessions/login', {message});
})

// Formulario de recuperacion de contraseña.
viewsRouter.get('/recover', publicView, (req, res)=>{
    const email = req.query.email;
    const user = req.query.user;
    const timestamp = req.query.timestamp;

    res.render('sessions/recover', {email, user, timestamp});
})

// Vista de perfil de usuario.
viewsRouter.get('/profile', privateView, (req, res)=>{
    res.render('users/profile');
})

// Vista de carga de documentos de usuario.
viewsRouter.get('/users/documents', privateView, (req, res)=>{
    const documents = {
        identificacion: fs.existsSync(`${__dirname}/public/documents/${req.session.user._id}/Identificacion.pdf`),
        domicilio: fs.existsSync(`${__dirname}/public/documents/${req.session.user._id}/Comprobante de Domicilio.pdf`),
        estado_cuenta: fs.existsSync(`${__dirname}/public/documents/${req.session.user._id}/Comprobante de Estado de Cuenta.pdf`)
    }

    res.render('users/userDocuments', {documents});
})

// Tabla ABM Usuarios.
viewsRouter.get('/users/abm', async(req, res, next)=>{
    try {
        let users = await userController.getUsers();

        res.render('users/usersTable', {users});
    } catch (error) {
        next(error);
    }
})

// Chat.
viewsRouter.get('/chat', privateView, handlePolicies(['USER']), async (req, res)=>{
    let messages = await messageDB.getMessages();

    res.render('chat', {messages});
})


// Views custom middlewares.
function privateView(req, res, next){       // Middleware de validacion de rutas privadas.
    if(!!!req.session.passport?.user) return res.redirect('/login?validation=1');

    next();
}

function publicView(req, res, next){        // Middleware de validacion de rutas publicas.
    if(!!req.session.passport?.user) return res.redirect('/profile');

    next();
}

export default viewsRouter;