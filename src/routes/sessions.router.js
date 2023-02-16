import { Router } from 'express';

import UserDB from '../daos/user.db.js';

const sessionsRouter = Router();

// Instancias de clases.
const userDB = new UserDB();

sessionsRouter.post('/register', async (req, res)=>{
    const userToAdd = req.body;

    let user = await userDB.addUser(userToAdd);

    res.redirect('/login?register=1');
})

sessionsRouter.post('/login', async (req, res)=>{
    let user_email = req.body.email;
    let user_pass = req.body.password;

    // Busqueda de usuario.
    let user = await userDB.getUserByCredentials(user_email, user_pass);

    // Si no se eocntro usuario...
    if(user.length === 0){
        return res.redirect('/login?validation=0');
    }

    // Se borra la password del objeto user por ser un dato sensible.
    delete user.password;
    req.session.user = user[0];

    res.redirect('/products');
})

sessionsRouter.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});

        res.redirect('/login?logout=1');
    });
})

export default sessionsRouter;