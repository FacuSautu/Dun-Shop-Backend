import express from 'express';

import __dirname from './utils.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

// Instancia de express y servidor.
const app = express();
const server = app.listen(8080, ()=>console.log("Server live on http://localhost:8080/"));

// Configuracion
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Rutas
app.use('/api/carts/', cartsRouter);
app.use('/api/products/', productsRouter);
