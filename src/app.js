import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import MessageDB from './daos/message.db.js';

// Instancia de express y servidor.
const port = 8080;
const app = express();
const server = app.listen(port, ()=>console.log(`Server live on http://localhost:${port}/`));
const io = new Server(server);

const messageDB = new MessageDB();
const conectedUsers = [];

io.on('connection', socket=>{
    console.log("Cliente conectado.");


    // Logica del chat.
    // Evento de nuevo mensaje.
    socket.on('new_message', async message=>{
        await messageDB.addMessage(message);

        let messages = await messageDB.getMessages().lean();
        
        io.emit('messages_log', messages);
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

// Instancia de Mongoose
mongoose.connect('mongodb+srv://fsautu:root@coderhouse.lomute3.mongodb.net/?retryWrites=true&w=majority', (error)=>{
    if(error){
        console.log("Cannot connect to database: "+error);
        process.exit();
    }
})

// Configuracion
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use((req, res, next)=>{
    req.io = io;
    next();
})

// Rutas
app.use('/', viewsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/products/', productsRouter);
