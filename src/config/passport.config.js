import passport from 'passport';
import local from 'passport-local';
import jwt, { ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2';

import config from './config.js';
import { isValidPassword } from '../utils.js';
import UserDbDAO from '../daos/user.db.dao.js';
import UserDTOReq from '../dtos/request/user.req.dto.js';
import UserDTO from '../dtos/response/user.res.dto.js';

// Manager de usuarios
const userDB = new UserDbDAO();

// Estrategias
const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;

// Extractores de JWT
const cookieExtractor = (req)=>{
    let token = null;

    if(req && req.cookies){
        token = req.cookies['user_jwt'];
    }

    return token;
}
const headerExtractor = (req)=>{
    let token = null;
    if(!!req.headers.authorization){
        token = req.headers.authorization.split(' ')[1];
    }

    return token;
}

const initializePassport = ()=>{
    // Estrategia de registro.
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req, username, password, done)=>{
            // const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userDB.getUserByEmail(req.email);

                if(!!user){
                    req.logger.error(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Ya existe este usuario`);
                    return done(null, false, {message: "Ya existe este usuario.", valCode:1});
                }

                if(!!req.file) req.body.profile_picture = `img/profiles/${req.file.filename}`;

                const newUser = new UserDTOReq(req.body);

                let result = await userDB.addUser(newUser);

                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: "+error);
            }
        }
    ))

    // Estrategia de login.
    passport.use('login', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req, username, password, done)=>{
            try {
                const user = await userDB.getUserByEmail(username);

                if(!!!user){
                    req.logger.warning(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Usuario no encontrado.`);
                    return done(null, false, {message:"Usuario no encontrado.", valCode:0});
                }
                if(!isValidPassword(user, password)){
                    req.logger.error(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Contraseña incorrecta.`);
                    return done(null, false, {message:"Contraseña incorrecta.", valCode:2});
                }

                await userDB.setLastConnection(user._id, new Date());

                return done(null, user);
            } catch (error) {
                req.logger.fatal(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: Error general en estrategia.`);
                return done("Error en estrategia de login: "+error);
            }
        })
    )

    // Estrategia de jwt.
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor, headerExtractor]),
        secretOrKey: config.jwt_private_key
    }, async(jwt_payload, done)=>{
        try {
            let userDTO = new UserDTO({
                first_name: jwt_payload.data.first_name,
                last_name: jwt_payload.data.last_name,
                email: jwt_payload.data.email,
                age: jwt_payload.data.age,
                rol: jwt_payload.data.rol,
                cart: jwt_payload.data.cart
            });

            return done(null, userDTO);
        } catch (error) {
            return done(error);
        }
    }))

    // Estrategia de login con Github.
    passport.use('github', new GitHubStrategy(
        {clientID:config.gitHub_ClientId, clientSecret:config.gitHub_ClientSecret, callbackURL:config.gitHub_CallbackURL},
        async (accessToken, refreshToken, profile, done)=>{
            try {
                let user = await userDB.getUserByEmail(profile._json.email);
                
                if(!!!user){
                    if(!!!profile._json.name || !!!profile._json.email) return done("El perfil no presenta Nombre o Email publicos, por favor modifique su perfil para obtener estos datos.");
                    
                    const newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        email: profile._json.email,
                        age: 0,
                        password: ''
                    }

                    let result = await userDB.addUser(newUser);

                    await userDB.setLastConnection(result._id, new Date());

                    done(null, result);
                }else{
                    await userDB.setLastConnection(user._id, new Date());

                    done(null, user);
                }
            } catch (error) {
                done("Error en estrategia de login con Github: "+error);
            }
        }
    ))

    
    passport.serializeUser((user, done)=>{
        done(null, user);
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userDB.getUserById(id);
        done(null, user);
    })
}

export default initializePassport;