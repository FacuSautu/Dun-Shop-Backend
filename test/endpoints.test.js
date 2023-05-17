import chai from 'chai';
import supertest from 'supertest';

import { generateProduct } from '../src/tests/mocks/products.mock.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe('Test de Endpoints', ()=>{
    describe('Products: ', ()=>{
        before(async function(){
            const adminUser = {
                email: 'admin@gmail.com',
                password: 'admin'
            }

            this.session = await requester.post('/api/sessions/login').send(this.adminUser);
            this.sessionCookie = {
                name: this.session.header['set-cookie'][0].split(' ')[0].split('=')[0],
                value: this.session.header['set-cookie'][0].split(' ')[0].split('=')[1]
            }

            this.testProduct = generateProduct();
            this.productOnDb;
        })
    
        it("Test de endpoint 'api/products/: Carga un producto nuevo' [POST]", async function(){

            console.log(this.session.header['set-cookie'][0].split(' ')[0].slice(0, -1));
    
            const {statusCode, ok, _body } = await requester.post('/api/products')
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0].slice(0, -1))
                .set('Connection', 'keep-alive')
                .set('Accept', '*/*')
                .send(this.testProduct);
    
            console.log("PRODUCTO: ", _body);

            expect(statusCode).to.be.deep.equal(200);
        })
    
        // it("Test de endpoint 'api/products/: Devuelve una serie de productos' [GET]", async function(){
        //     const {statusCode, ok, _body } = await requester.get('/api/products');
    
        //     expect(Array.isArray(_body.payload)).to.be.true;
        //     expect(_body.payload[0]).to.be.ok;
        // })
    
        // it("Test de endpoint 'api/products/:pid: Devuelve un producto' [GET]", async function(){
        //     const {statusCode, ok, _body } = await requester.get('/api/products');
        // })
    
        // it("Test de endpoint 'api/products/:pid: Modifica un producto' [PUT]", async function(){
        //     const {statusCode, ok, _body } = await requester.get('/api/products');
        // })
    
        // it("Test de endpoint 'api/products/:pid: Elimina un producto' [DELETE]", async function(){
        //     const {statusCode, ok, _body } = await requester.get('/api/products');
        // })
    })

})