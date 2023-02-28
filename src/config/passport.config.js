import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import config from './config.js';
import { createHash, isValidPassword } from '../utils.js';
import UserDB from '../daos/user.db.js';

// Manager de usuarios
const userDB = new UserDB();

const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    // Estrategia de registro.
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req, username, password, done)=>{
            const {first_name, last_name, email, age} = req.body;

            try {
                let user = await userDB.getUserByEmail(email);

                if(!!user){
                    console.log("Ya existe este usuario");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                let result = await userDB.addUser(newUser);

                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: "+error);
            }
        }
    ))

    // Estrategia de login.
    passport.use('login', new LocalStrategy(
        {usernameField:'email'},
        async (username, password, done)=>{
            try {
                const user = await userDB.getUserByEmail(username);

                if(!!!user){
                    console.log("Usuario no encontrado.");
                    return done(null, false);
                }
                if(!isValidPassword(user, password)) return done(null, false);

                return done(null, user);
            } catch (error) {
                return done("Error en estrategia de login: "+error);
            }
        })
    )

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
                    done(null, result);
                }else{
                    done(null, user);
                }
            } catch (error) {
                done("Error en estrategia de login con Github: "+error);
            }
        }
    ))

    
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userDB.getUserById(id);
        done(null, user);
    })
}

export default initializePassport;