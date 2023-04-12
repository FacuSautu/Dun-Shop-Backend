import EErrors from './enums.js';

export default (error, req, res, next)=>{
    console.log("CAUSA DEL ERROR: ", error.cause);

    let errorCodes = [];

    Object.keys(EErrors).forEach(errorProp => {
        errorCodes.concat(Object.values(errorProp))
    });

    if(errorCodes.includes(error.code)){
        res.send({status:'error', message:error.message, code:error.code})
    }else{
        res.send({status:'error', message:"Unhandled error"})
    }
}