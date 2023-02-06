import { Router } from 'express';

import __dirname from '../utils.js';
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

    res.render('home', {products});
})

viewsRouter.get('/realtimeproducts', async (req, res)=>{
    let products = await productDB.getProducts().lean();

    req.io.on('connection', socket=>{
        console.log("Cliente conectado a productos en tiempo real.");
    })

    res.render('realTimeProducts', {products});
})

viewsRouter.get('/chat', async (req, res)=>{
    let messages = await messageDB.getMessages().lean();

    const conectedUsers = [];

    // Evento de conexion de usuario.
    req.io.on('connection', socket=>{
        console.log("Cliente conectado al chat.");
        

        // Evento de nuevo mensaje.
        socket.on('new_message', async message=>{
            console.log(message);

            await messageDB.addMessage(message);
    
            let messages = await messageDB.getMessages().lean();
            
            req.io.emit('messages_log', messages);
        });

        // Evento de nuevo usuario.
        socket.on('new_user', async user=>{
            let messages = await messageDB.getMessages().lean();
            let validationObj = {
                validation: true,
                user,
                messages
            }

            console.log(conectedUsers, user, conectedUsers.includes(user));

            if(conectedUsers.includes(user)){
                validationObj.validation = false;
            }else{
                conectedUsers.push(user);
            }
    
            socket.emit('auth_user', validationObj);
            if(validationObj.validation) socket.broadcast.emit('new_user_connected', user);
        });

    })

    res.render('chat', {messages});
})

export default viewsRouter;