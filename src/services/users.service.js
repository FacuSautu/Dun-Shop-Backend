import fs from 'fs';

import { UsersFty } from '../daos/factory.js';
import { __dirname, createHash } from '../utils.js';

import CustomError from './errors/CustomError.js';
import EErrors from './errors/enums.js';
import { faltaDocumentacion } from './errors/info/users.error.info.js';

class UserService{
    constructor(){
        this.persistanceEngine = new UsersFty();
    }

    addUser(userToAdd){
        return this.persistanceEngine.addUser(userToAdd);
    }

    getUserByEmail(email){
        return this.persistanceEngine.getUserByEmail(email);
    }

    getUserById(id){
        return this.persistanceEngine.getUserById(id);
    }

    updateUserPassword(id, new_password){
        const password = createHash(new_password);
        
        return this.persistanceEngine.updateUserPassword(id, password);
    }

    async changeRol(id){
        const user = await this.persistanceEngine.getUserById(id);
        let new_rol;

        if(user.rol.toUpperCase() === 'PREMIUM'){
            new_rol = 'user';
        }else if (user.rol.toUpperCase() === 'USER') {
            new_rol = 'premium';
        }

        let documents = {
            identificacion: fs.existsSync(`${__dirname}/public/documents/${id}/Identificacion.pdf`),
            domicilio: fs.existsSync(`${__dirname}/public/documents/${id}/Comprobante de Domicilio.pdf`),
            estado_cuenta: fs.existsSync(`${__dirname}/public/documents/${id}/Comprobante de Estado de Cuenta.pdf`)
        }

        if((!documents.identificacion || !documents.domicilio || !documents.estado_cuenta) && new_rol === 'premium'){
            CustomError.createError({
                name: "Falta documentacion",
                cause: faltaDocumentacion(documents),
                message: `Faltan cargar documentacion necesaria para el cambio de rol.`,
                code: EErrors.USERS.MISSING_DOCUMENTS
            });
        }

        await this.persistanceEngine.updateUserRol(id, new_rol);

        return new_rol;
    }

    setLastConnection(id){
        return this.persistanceEngine.setLastConnection(id, new Date());
    }

    addDocument(id, document){
        return this.persistanceEngine.addDocument(id, document);
    }
}

export default UserService;