import { Router } from "express";

import { generateProducts } from '../tests/mocks/products.mock.js';
import { generateUsers } from '../tests/mocks/users.mock.js';

const mocksRouter = Router();

mocksRouter.get('/mockingproducts', (req, res)=>{
    let qty = req.query.qty || 50;

    const products = generateProducts(qty);

    res.send({status:'success', payload:products});
})

mocksRouter.get('/mockingusers', (req, res)=>{
    let qty = req.query.qty || 20;

    const users = generateUsers(qty);

    res.send({status:'success', payload:users});
})

export default mocksRouter;