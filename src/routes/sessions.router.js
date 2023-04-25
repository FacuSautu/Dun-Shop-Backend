import { Router } from 'express';
import passport from 'passport';

import config from '../config/config.js';
import { authToken, generateToken } from '../utils.js';

const sessionsRouter = Router();

// Registro de usuarios.
sessionsRouter.post('/register', (req, res, next)=>{
    passport.authenticate('register', (err, user, info)=>{
        if(err) return next(err);
        if(!user) return res.status(409).send({status:'error', message: info.message ? info : {message:"Error de registro", valCode:0}});

        res.send({status:'success', message:"Usuario registrado con exito."});
    })(req, res, next)
})

// Falla en registro.
sessionsRouter.get('/failregister', (req, res)=>{
    req.logger.critical(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Error en estrategia de registro.`);
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
    req.logger.critical(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Error en estrategia de login.`);
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

        res.redirect('/login?logout=1');
    });
})

export default sessionsRouter;