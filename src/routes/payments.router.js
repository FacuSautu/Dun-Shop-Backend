import { Router } from "express";

import PaymentService from "../services/payments.service.js";

const paymentsRouter = Router();

const paymentService = new PaymentService();

paymentsRouter.post('/payment-intent', async(req, res, next)=>{
    try {
        const cartId = req.body.cartId;
    
        const paymentIntentInfo = await paymentService.createPaymentIntentFromCart(cartId);

        console.log(paymentIntentInfo);

        res.send({status:'success', message:'Payment intent generado.', payload:paymentIntentInfo});
    } catch (error) {
        next(error);
    }
})

export default paymentsRouter;