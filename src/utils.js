import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from './config/config.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+'/public/img');
    },
    filename:function(req, file, cb){
        cb(null, file.originalname);
    }
})

// Multer utilities.
export const uploader = multer({storage});

// Bcrypt utilities.
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

// Path utilities.
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// JWT utilities.
const JWT_PRIVATE_KEY = config.jwt_private_key;

export const generateToken = (data)=>{
    return jwt.sign({data}, JWT_PRIVATE_KEY, {expiresIn:'24h'});
}

export const authToken = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).send({status:'error', message: "Not authenticated"});

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.send(403).send({status:'error', message: "Not authorized"});

        req.user = credentials.user;
        next();
    })
}