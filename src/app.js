import cluster from 'cluster';
import { cpus } from 'os';
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import compression from 'express-compression';

import { __dirname, addLogger } from './utils.js';
import config from './config/config.js';
import initializePassport from './config/passport.config.js';
import MessageDbDAO from './daos/message.db.dao.js';
import errorHandler from './services/errors/errorHandler.middleware.js';

import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import mocksRouter from './routes/mocks.router.js';

if(cluster.isPrimary){
    console.log("Levantando proceso primario, se procede a crear worker process:");

    const numOfCpus = cpus().length;

    for (let i = 0; i < numOfCpus; i++) {
        cluster.fork();
    }
}else{
    console.log(`Creado worker process, ID: ${process.pid}`);
    
    // Instancia de express server y websocket.
    const app = express();
    const server = app.listen(config.port, ()=>console.log(`Server live on http://${config.host}:${config.port}/`));
    const io = new Server(server);
    
    // Logica de chat con Websocket
    const messageDB = new MessageDbDAO();
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
    
    // Instancia de mailing y twilio
    const mailer = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth:{
            user: 'facundo.sautu@gmail.com',
            pass: config.google_app_password
        }
    })
    
    const twilioClient = twilio(config.twilio_account_sid, config.twilio_auth_token);
    
    // Configuracion
    app.engine('handlebars', handlebars.engine());                  // Creacion del motor de vistas.
    
    app.set('views', __dirname+'/views');                           // Definicion de carpeta Views.
    app.set('view engine', 'handlebars');                           // Seteo del motor de vistas a usar.
    
    // Middlewares
    app.use(express.static(__dirname+'/public'));                   // Path statico para carpeta public.
    app.use(express.urlencoded({extended:true}));                   // Decodificacion de datos req.
    app.use(express.json());                                        // Decodificacion de datos en JSON.
    app.use(compression({brotli:{enabled:true, zlib:{}}}));         // Compresion de paquetes de respuesta.
    app.use(cookieParser());                                        // Gestor de cookies.
    app.use(session({                                               // Administrador de sesiones.
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
    app.use(passport.initialize());                                 // Inicializacion de passport.
    app.use(passport.session());                                    // Inicializacion de administrador de sesiones de passport.
    app.use(addLogger);                                             // Agregado de Logger al objeto request.
    
    // Custom middlewares
    app.use((req, res, next)=>{     // Middleware para agregar a las variables locales del objeto Response los datos de sesión.
        res.locals.session = req.session;
        res.locals.session.user = req.session.passport?.user;
        next();
    })
    
    app.use((req, res, next)=>{     // Middleware para agregar utilidades al objeto Request (server websocket, mailer, cliente twilio).
        req.io = io;
        req.mailer = mailer;
        req.twilioClient = twilioClient;
        
        next();
    })
    
    // Rutas
    app.use('/', viewsRouter);
    app.use('/api/sessions/', sessionsRouter);
    app.use('/api/users/', usersRouter);
    app.use('/api/carts/', cartsRouter);
    app.use('/api/products/', productsRouter);
    app.use('/api/tests/', mocksRouter);
    app.use(errorHandler);
}