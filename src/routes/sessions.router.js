import { Router } from 'express';
import passport from 'passport';

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
sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: 'faillogin'}), (req, res)=>{
    if(!!!req.user) return res.redirect('/login?validation=0');
    req.session.user = req.user;
    
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
    req.session.user = req.user;

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