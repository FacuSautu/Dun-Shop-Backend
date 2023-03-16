import { Router } from 'express';
import passport from 'passport';

import config from '../config/config.js';
import { generateToken } from '../utils.js';

const sessionsRouter = Router();

// Registro de usuarios.
sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), (req, res)=>{
    res.redirect('/login?register=1');
})

// Falla en registro.
sessionsRouter.get('/failregister', (req, res)=>{
    console.log("Error en estrategia de registro.");
    res.send({status:'error', message:"Error en estrategia de registro"});
})

// Login de usuarios.
sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: 'faillogin', session:config.login_strategy=='session'}), (req, res)=>{
    if(!!!req.user) return res.redirect('/login?validation=0');

    if (config.login_strategy == 'jwt') {
        const user_jwt = generateToken(req.user);
        res.cookie('user_jwt', user_jwt, {maxAge:60*60*1000, httpOnly:true});
    }

    res.redirect('/');
})

// Falla en login.
sessionsRouter.get('/faillogin', (req, res)=>{
    console.log("Error en estrategia de login.");
    res.redirect('/login?validation=0');
})

// Login de usuarios con Github.
sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), (req, res)=>{})

// Login con Github exitoso.
sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login?validation=2'}), (req, res)=>{
    res.redirect('/');
})

// Logout de usuarios.
sessionsRouter.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});

        res.redirect('/login?logout=1');
    });
})

export default sessionsRouter;