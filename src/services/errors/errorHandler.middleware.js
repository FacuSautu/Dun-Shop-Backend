import EErrors from './enums.js';

export default (error, req, res, next)=>{
    console.log("ERROR: ", error);
    req.logger.fatal(`Petición ${req.method} en ${req.url} [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]: ERROR: ${error}`);

    let errorCodes = [];

    Object.keys(EErrors).forEach(errorProp => {
        errorCodes = errorCodes.concat(Object.values(EErrors[errorProp]))
    });

    if(errorCodes.includes(error.code)){
        res.send({status:'error', message:error.message, code:error.code, cause:error.cause})
    }else{
        res.send({status:'error', message:"Unhandled error"})
    }
}