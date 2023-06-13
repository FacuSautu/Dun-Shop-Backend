import { Router } from "express";

import CartController from "../controllers/carts.controller.js";
import ProductController from "../controllers/products.controller.js";
import TicketController from "../controllers/ticket.controller.js";
import { handlePolicies } from "../utils.js";
import config from "../config/config.js";

const cartsRouter = Router();

// Instancias de clases.
const cartController = new CartController;
const productController = new ProductController;
const ticketController = new TicketController;

// Muestra los datos de un carrito.
cartsRouter.get('/:cid', async (req, res, next)=>{
    try {
        let cid = req.params.cid;
        
        let cartToShow = await cartController.getCart(cid, true);
        
        if(!!cartToShow){
            res.send({status:'success', payload:cartToShow.products});
        }else{
            res.status(404).send({status:'error', message:`No se encontro carrito con el ID ${cid}`});
        }
    } catch (error) {
        next(error);
    }
})

// Agrega un nuevo carrito.
cartsRouter.post('/', async (req, res, next)=>{
    try {
        let newCart = req.body;
    
        const addedCart = await cartController.addCart(newCart);
        
        res.send({status:'success', message: `El carrito fue agregado con exito. ID: ${addedCart?._id || addedCart?.cartId}`});
    } catch (error) {
        next(error);
    }
})

// Agrega un producto al carrito indicado.
cartsRouter.post('/:cid/product/:pid', handlePolicies(["USER", "PREMIUM", "ADMIN"]), async (req, res, next)=>{
    try {
        let productId = req.params.pid;
        let cartId = req.params.cid;
        let { qty } = req.body;
    
        await cartController.addProductToCart(cartId, productId, qty, req.user);
    
        res.send({status: 'success', message: `Producto ${productId} cargado con exito al carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

// Modificar el array de productos de un carrito.
cartsRouter.put('/:cid', async (req, res, next)=>{
    try {
        const cartId = req.params.cid;
        const { products } = req.body;

        await cartController.updateCart(cartId, products);

        res.send({status: 'success', message: `Carrito modificado con exito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

// Modifica la cantidad de un producto en un carrito.
cartsRouter.put('/:cid/product/:pid', async (req, res, next)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
    
        await cartController.updateProdQty(cartId, productId, quantity);
    
        res.send({status: 'success', message: `Se modifico la cantidad del producto ${productId} por ${quantity}. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

// Eliminar un producto de un carrito.
cartsRouter.delete('/:cid/product/:pid', async (req, res, next)=>{
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;
    
        await cartController.deleteProduct(cartId, productId);

        res.send({status: 'success', message: `Producto ${productId} eliminado con exito del carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

// Eliminar todos los productos de un carrito.
cartsRouter.delete('/:cid', async (req, res, next)=>{
    try {
        let cartId = req.params.cid;
    
        await cartController.deleteAllProducts(cartId);

        res.send({status: 'success', message: `Se eliminaron todos los productos del carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

// Realizar compra del contenido del carrito
cartsRouter.get('/:cid/purchase', async (req, res, next)=>{
    try {
        let cid = req.params.cid;
        let cart = await cartController.getCart(cid, true);
        let totalCompra = 0;
        let soldItems = [];
        let itemsOutOfStock = [];
        let phone = req.query.phone;
        
        // Chequeo y modificacion de stock.
        cart.products.forEach(async (prod)=>{
            if(prod.product.stock > 0 || prod.product.stock >= prod.quantity) {
                productController.updateProduct(prod.product._id, {stock: prod.product.stock-prod.quantity});
                cartController.deleteProduct(cart._id.toString(), prod.product._id.toString());
                soldItems.push(prod.product.title);
                totalCompra += prod.product.price*prod.quantity;
            }else{
                itemsOutOfStock.push({
                    id:prod.product._id,
                    title:prod.product.title,
                    stock: prod.product.stock, 
                    quantity:prod.quantity
                });
            }
        });
        
        // Si hay items para vender...
        if(soldItems.length > 0){
            // Armado y carga del ticket
            let ticketData = {
                code: `TCKT-${Date.now()}`,
                amount: totalCompra,
                purchaser: req.user.email
            }
    
            let ticket = await ticketController.generateTicket(ticketData);

            // Armado del mail.
            let mail_body = `<div>
                                <h1>Su compra se realizo exitosamente!</h1>
                                <p> Buenos dias ${req.user.first_name} ${req.user.last_name}! Se te avisa que tu compra por los siguientes productos fue realizada con el ticket N° ${ticket._id}</p>
                                <ul>`;
    
            soldItems.forEach(item=>mail_body += `<li>${item}</li>`);
            mail_body += `</ul>
                        <br>
                        <p>Muchas gracias por confiar en nosotros!</p>
                        <p>Que tengas buen dia.</p>`;
    
            req.mailer.sendMail({
                from: 'Dun-shop E-Commerce <noreplay@mail.com.ar',
                to: req.user.email,
                subject: 'Compra realizada!',
                html:mail_body,
                attachments:[]
            })

            // Si se indica un numero telefonico se envia SMS.
            if(!!phone){
                req.twilioClient.messages.create({
                    body: `Su compra en Dun-shop fue realizada con el N° de ticket ${ticket._id}`,
                    from: config.twilio_sms_number,
                    to: `+54${phone}`
                })
            }

            res.send({status:'success', payload:{ticket:ticket._id, products_out_of_stock:itemsOutOfStock}});
        }else{
            res.status('404').send({status:'error', message:'No se pudo realizar la compra por falta de stock.'});
        }

    } catch (error) {
        next(error);
    }
})

export default cartsRouter;