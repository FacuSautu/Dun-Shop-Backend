import { Router } from 'express';
import passport from 'passport';

import config from '../config/config.js';
import { authToken, generateToken, isValidPassword, uploader } from '../utils.js';
import UserService from '../services/users.service.js';

import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { samePass } from '../services/errors/info/users.error.info.js';

const sessionsRouter = Router();

const userService = new UserService();

// Registro de usuarios.
sessionsRouter.post('/register', uploader.single('profile_picture'), (req, res, next)=>{
    passport.authenticate('register', (err, user, info)=>{
        if(err) return next(err);
        if(!user) return res.status(409).send({status:'error', message: info.message ? info : {message:"Error de registro", valCode:0}});

        res.send({status:'success', message:"Usuario registrado con exito."});
    })(req, res, next)
})

// Falla en registro.
sessionsRouter.get('/failregister', (req, res)=>{
    req.logger.fatal(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Error en estrategia de registro.`);
    res.send({status:'error', message:"Error en estrategia de registro"});
})

// Login de usuarios.
sessionsRouter.post('/login', (req, res, next)=>{
    passport.authenticate('login', (err, user, info)=>{
        if(err) return next(err);
        if(!user) return res.status(404).send({status: 'error', message: info.message ? info : {message:"Error de autenticacion", valCode:0}});

        if (config.login_strategy.toUpperCase() === 'JWT') {
            const user_jwt = generateToken(user);
            return res.cookie('user_jwt', user_jwt, {maxAge:60*60*1000, httpOnly:true}).send({status:'success', message:"Usuario logueado con exito."});
        }else{
            req.login(user, loginErr=>{
                if(loginErr) return next(loginErr);

                return res.send({status:'success', message:"Usuario logueado con exito."});
            })
        }
    })(req, res, next)
})

// Falla en login.
sessionsRouter.get('/faillogin', (req, res)=>{
    req.logger.fatal(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Error en estrategia de login.`);
    res.status(404).send({status: 'error', message: {message:"Error de autenticacion", valCode:0}});
})

// Login de usuarios con Github.
sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), (req, res)=>{})

// Login con Github exitoso.
sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login?validation=2'}), (req, res)=>{
    res.redirect('/');
})

// Obtencion de usuario actual por jwt
sessionsRouter.get('/current', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send({status:'success', payload:req.user});
})

// Logout de usuarios.
sessionsRouter.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});

        userService.setLastConnection(req.user._id);

        res.status(301).redirect('/login?logout=1');
    });
})

// Generador de link para recuperacion de contraseña.
sessionsRouter.get('/recover', async (req, res, next)=>{
    try {
        const email = req.query.email;
        const user = await userService.getUserByEmail(email);

        // Armado del mail.
        let mail_body = `<div>
            <h1>Mail de recuperacion de contraseña</h1>
            <p>Para poder recuperar su contraseña haga click <a href="http://${config.host}:${config.port}/recover?email=${email}&user=${user._id}&timestamp=${Date.now()}">aqui</a>, sera redireccionado a otra pagina donde podra indicar una nueva contraseña.</p>
            <p>Si usted no solicito la recuperacion de su contraseña por favor desestime este e-mail.</p>
        </div>`;

        req.mailer.sendMail({
            from: 'Dun-shop E-Commerce <noreplay@mail.com.ar',
            to: email,
            subject: 'Recuperacion de contraseña',
            html:mail_body,
            attachments:[]
        })
    
        res.send({status:'success', payload: mail_body});
    } catch (error) {
        next(error);
    }
})

// Recuperacion de contraseña.
sessionsRouter.post('/recover', async (req, res, next)=>{
    try {
        const id = req.body.user;
        const pass = req.body.new_password;

        let user = await userService.getUserById(id);
    
        if(isValidPassword(user, pass)) 
            CustomError.createError({
                name: "Misma contraseña",
                cause: samePass(),
                message: `No puede cambiar la contraseña por la existente.`,
                code: EErrors.USERS.SAME_PASSWORD
            });

        await userService.updateUserPassword(user, pass);
    
        res.send({status:'success', message:`Contraseña modificada!`});
    } catch (error) {
        next(error);
    }
})

export default sessionsRouter;