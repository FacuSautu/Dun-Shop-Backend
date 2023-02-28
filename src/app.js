import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';

import { __dirname, uploader } from './utils.js';
import config from './config/config.js';
import initializePassport from './config/passport.config.js';

import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import MessageDB from './daos/message.db.js';

// Instancia de express y servidor.
const app = express();
const server = app.listen(config.port, ()=>console.log(`Server live on http://localhost:${config.port}/`));
const io = new Server(server);

// Logica de chat con Websocket
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
mongoose.connect(config.mongoUrl, (error)=>{
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
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://fsautu:root@coderhouse.lomute3.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:15
    }),
    secret:'dunShopSecret',
    resave:true,
    saveUninitialized:true
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Custom middlewares
app.use((req, res, next)=>{     // Middleware para agregar a las variables locales del objeto Response los datos de sesión.
    res.locals.session = req.session;
    next();
})

app.use((req, res, next)=>{     // Middleware para agregar el WebSocket al objeto Request.
    req.io = io;
    next();
})

// Rutas
app.use('/', viewsRouter);
app.use('/api/sessions/', sessionsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/products/', productsRouter);
