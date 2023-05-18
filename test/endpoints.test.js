import chai from 'chai';
import supertest from 'supertest';

import { generateProduct } from '../src/tests/mocks/products.mock.js';
import { generateCart, generateCartproductsForReq } from '../src/tests/mocks/carts.mock.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe('Test de Endpoints', ()=>{
    describe('Products: ', ()=>{
        before(async function(){
            const adminUser = {
                email: 'admin@gmail.com',
                password: 'admin'
            }

            this.session = await requester.post('/api/sessions/login').send(adminUser);

            this.testProduct = generateProduct();
            delete this.testProduct._id;

            this.productOnDbId;
            this.productOnDb;
        })

        beforeEach(function(){
            this.timeout(7000);
        })
    
        it("Test de endpoint 'api/products/' [POST], sin logearse: No deberia dejar carga un producto nuevo", async function(){
            const {statusCode, ok, _body } = await requester.post('/api/products')
                .send(this.testProduct);

            expect(statusCode).to.be.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/' [POST]: Carga un producto nuevo", async function(){
            const {statusCode, ok, _body } = await requester.post('/api/products')
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0])
                .send(this.testProduct);
            this.productOnDbId = _body.message.replace('Producto cargado exitosamente. ID: ', '');
            
            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message.includes("Producto cargado exitosamente. ID: ")).to.be.deep.true;
        })
    
        it("Test de endpoint 'api/products/' [GET]: Devuelve una serie de productos", async function(){
            const {statusCode, ok, _body } = await requester.get('/api/products');
    
            expect(Array.isArray(_body.payload)).to.be.true;
            expect(_body.payload[0]).to.be.ok;
        })
    
        it("Test de endpoint 'api/products/:pid' [GET]: Devuelve un producto", async function(){
            const {statusCode, ok, _body } = await requester.get(`/api/products/${this.productOnDbId}`);

            expect(statusCode).to.be.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.payload).to.have.property('_id');

            this.productOnDb = _body.payload;
        })
    
        it("Test de endpoint 'api/products/:pid' [PUT], sin logearse: Modifica un producto", async function(){
            let productToMod = this.productOnDb;
            productToMod.title += ' MOD';
            delete productToMod._id;

            const {statusCode, ok, _body } = await requester.put(`/api/products/${this.productOnDbId}`)
                .send(productToMod);

            expect(statusCode).to.be.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/:pid' [PUT]: Modifica un producto", async function(){
            let productToMod = this.productOnDb;
            productToMod.title += ' MOD';
            delete productToMod._id;

            const {statusCode, ok, _body } = await requester.put(`/api/products/${this.productOnDbId}`)
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0])
                .send(productToMod);

            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message).to.be.deep.equal(`Producto modificado exitosamente. ID: ${this.productOnDbId}`);
        })
    
        it("Test de endpoint 'api/products/:pid' [DELETE], sin logearse: Elimina un producto", async function(){
            const {statusCode, ok, _body } = await requester.delete(`/api/products/${this.productOnDbId}`);

            expect(statusCode).to.be.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/:pid' [DELETE]: Elimina un producto", async function(){
            const {statusCode, ok, _body } = await requester.delete(`/api/products/${this.productOnDbId}`)
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0]);

            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message).to.be.deep.equal(`Producto eliminado exitosamente. ID: ${this.productOnDbId}`);
        })
    })


    describe('Carts: ', ()=>{
        before(async function(){
            const adminUser = {
                email: 'admin@gmail.com',
                password: 'admin'
            }

            this.session = await requester.post('/api/sessions/login').send(adminUser);

            this.testCart = await generateCartproductsForReq();

            this.cartOnDbId;
            this.cartOnDb;
        })

        beforeEach(function(){
            this.timeout(5000);
        })
        
        it("Endpoint '/' [POST]: Generar un nuevo carrito", async function(){
            // const {statusCode, ok, _body } = await requester.post('/api/carts/').send(this.testCart);

            console.log(this.testCart);

            // expect(statusCode).to.be.deep.ok;
            // expect(_body.status).to.be.deep.equal('success');
            // expect(_body.message.includes('El carrito fue agregado con exito. ID: ')).to.be.true;
        })

        // it("Endpoint '/:cid' [GET]: Obtener un carrito", async function(){
        //     // const {statusCode, ok, _body } = await requester.post('/api/products')
        //     //     .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0])
        //     //     .send(this.testProduct);
        // })

        // it("Endpoint '/:cid/product/:pid' [POST]: Agregar un producto al carrito", async function(){

        // })

        // it("Endpoint '/:cid' [PUT]: Modificar los productos de un carrito", async function(){

        // })

        // it("Endpoint '/:cid/product/:pid' [PUT]: Modificar la cantidad de un producto al carrito", async function(){

        // })

        // it("Endpoint '/:cid/product/:pid' [DELETE]: Eliminar un producto de un carrito", async function(){

        // })

        // it("Endpoint '/:cid' [DELETE]: Eliminar todos los productos de un carrito", async function(){

        // })

        // it("Endpoint '/:cid/purchase' [GET]: Realizar la compra de un carrito", async function(){

        // })
    })
})