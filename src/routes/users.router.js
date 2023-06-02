import { Router } from "express";

import UserController from "../controllers/users.controller.js";
import { __dirname, handlePolicies, uploader } from "../utils.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { fileNotFound } from "../services/errors/info/users.error.info.js";

const usersRouter = Router();

const userController = new UserController();

// Lista todos los usuarios (Datos no sensibles).
usersRouter.get('/', handlePolicies(['PREMIUM', 'ADMIN']), async(req, res, next)=>{
    try {
        const users = await userController.getUsers();

        res.send({status:'success', message:'Usuarios encontrados.', payload:users});
    } catch (error) {
        next(error);
    }
})

// Cambio rol de usuario.
usersRouter.get('/premium/:uid', handlePolicies(['PREMIUM', 'USER']), async (req, res, next)=>{
    try {
        const uid = req.params.uid;

        let changeRol = await userController.changeRol(uid);

        if(req.session.user._id === uid) req.session.user.rol = changeRol;

        res.send({status:'success', message:`Rol del usuario modificado a ${changeRol.toUpperCase()}.`});
    } catch (error) {
        next(error);
    }
})

// Carga de documentos.
usersRouter.post('/:uid/documents', handlePolicies(['USER', 'PREMIUM', 'ADMIN']),
    uploader.fields([
        {name: 'document', maxCount: 3},
        {name: 'identificacion', maxCount: 1},
        {name: 'domicilio', maxCount: 1},
        {name: 'estado_cuenta', maxCount: 1}
    ]),
    async(req, res, next)=>{

    try {
        const uid = req.params.uid;
        const filesToAdd = [];

        // Se chequea que se enviaran archivos.
        if(!!!req.files){
            CustomError.createError({
                name: "No se envio ningun archivo",
                cause: fileNotFound(),
                message: `No se enviaron archivos adjuntos para ser guardados`,
                code: EErrors.USERS.FILES_NOT_FOUND
            });
        }

        // Se carga en un array todos los documentos que se esten agregando.
        if(!!req.files.document){
            req.files.document.forEach(async file=>{    
                let newDocument = {
                    name: 'document',
                    reference: `img/documents/${uid}/${file.filename}`
                }
        
                filesToAdd.push(newDocument);
            })
        }

        if(!!req.files.identificacion){
            let newDocument = {
                name: 'identificacion',
                reference: `img/documents/${uid}/${req.files.identificacion[0].filename}`
            }

            filesToAdd.push(newDocument);
        }
        if(!!req.files.domicilio){
            let newDocument = {
                name: 'domicilio',
                reference: `img/documents/${uid}/${req.files.domicilio[0].filename}`
            }

            filesToAdd.push(newDocument);
        }
        if(!!req.files.estado_cuenta){
            let newDocument = {
                name: 'estado_cuenta',
                reference: `img/documents/${uid}/${req.files.estado_cuenta[0].filename}`
            }

            filesToAdd.push(newDocument);
        }

        let loadDocuments = await userController.loadDocuments(uid, filesToAdd);

        res.send({status:'success', message:'Documento/s cargado/s con exito.'});
    } catch (error) {
        next(error);
    }
})

// Eliminar usuarios vencidos.
usersRouter.delete('/', async(req, res, next)=>{
    try {
        await userController.deleteExpiredUsers();

        res.send({status:'success', message:'Usuarios eliminados exitosamente'});
    } catch (error) {
        next(error);
    }
})

export default usersRouter;