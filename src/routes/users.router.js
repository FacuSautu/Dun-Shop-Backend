import { Router } from "express";

import UserService from "../services/users.service.js";
import { __dirname, handlePolicies, uploader } from "../utils.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { fileNotFound } from "../services/errors/info/users.error.info.js";

const usersRouter = Router();

const userService = new UserService();

// Cambio rol de usuario.
usersRouter.get('/premium/:uid', handlePolicies(['PREMIUM', 'USER']), async (req, res, next)=>{
    try {
        const uid = req.params.uid;

        let changeRol = await userService.changeRol(uid);

        res.send({status:'success', payload:`Rol del usuario modificado a ${changeRol.toUpperCase()}.`});
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

        // Se chequea que se enviaran archivos
        if(!!!req.files){
            CustomError.createError({
                name: "No se envio ningun archivo",
                cause: fileNotFound(),
                message: `No se enviaron archivos adjuntos para ser guardados`,
                code: EErrors.USERS.FILES_NOT_FOUND
            });
        }

        // Se analizan los documentos para cargarlos a cada usuario.
        if(!!req.files.document){
            req.files.document.forEach(async file=>{    
                let newDocument = {
                    name: 'document',
                    reference: `img/documents/${uid}/${file.filename}`
                }
        
                await userService.addDocument(uid, newDocument);
            })
        }

        if(!!req.files.identificacion){
            let newDocument = {
                name: 'identificacion',
                reference: `img/documents/${uid}/${req.files.identificacion[0].filename}`
            }

            await userService.addDocument(uid, newDocument);
        }
        if(!!req.files.domicilio){
            let newDocument = {
                name: 'domicilio',
                reference: `img/documents/${uid}/${req.files.domicilio[0].filename}`
            }

            await userService.addDocument(uid, newDocument);
        }
        if(!!req.files.estado_cuenta){
            let newDocument = {
                name: 'estado_cuenta',
                reference: `img/documents/${uid}/${req.files.estado_cuenta[0].filename}`
            }

            await userService.addDocument(uid, newDocument);
        }

        res.send({status:'success', message:'Documento cargado con exito.'});
    } catch (error) {
        next(error);
    }
})

export default usersRouter;