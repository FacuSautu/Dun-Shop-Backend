import chai from 'chai';
import supertest from 'supertest';

import { generateProduct } from '../src/tests/mocks/products.mock.js';
import { generateCartproductsForReq, generateCartForReq, getRandomProductOnDB } from '../src/tests/mocks/carts.mock.js';
import { generateUser } from '../src/tests/mocks/users.mock.js';
import { isValidPassword } from '../src/utils.js';

import ProductService from '../src/services/products.service.js';
import cartModel from '../src/daos/models/cart.model.js';
import UserService from '../src/services/users.service.js';
import userModel from '../src/daos/models/user.model.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

export const EndpointTests = describe('Test de Endpoints', ()=>{
    describe('Products: ', ()=>{
        before(async function(){
            this.timeout(5000);

            this.productService = new ProductService();

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
            this.timeout(5000);
        })
    
        it("Test de endpoint 'api/products/' [POST], sin logearse: No deberia dejar carga un producto nuevo", async function(){
            const {statusCode, _body } = await requester.post('/api/products')
                .send(this.testProduct);

            expect(statusCode).to.be.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/' [POST]: Carga un producto nuevo", async function(){
            const {statusCode, _body } = await requester.post('/api/products')
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0])
                .send(this.testProduct);
            this.productOnDbId = _body.message.replace('Producto cargado exitosamente. ID: ', '');
            
            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message.includes("Producto cargado exitosamente. ID: ")).to.be.deep.true;
        })
    
        it("Test de endpoint 'api/products/' [GET]: Devuelve una serie de productos", async function(){
            const {statusCode, _body } = await requester.get('/api/products');
    
            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(Array.isArray(_body.payload)).to.be.true;
            expect(_body.payload[0]).to.be.ok;
        })
    
        it("Test de endpoint 'api/products/:pid' [GET]: Devuelve un producto", async function(){
            const {statusCode, _body } = await requester.get(`/api/products/${this.productOnDbId}`);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.payload).to.have.property('_id');

            this.productOnDb = _body.payload;
        })
    
        it("Test de endpoint 'api/products/:pid' [PUT], sin logearse: Modifica un producto", async function(){
            let productToMod = this.productOnDb;
            productToMod.title += ' MOD';
            delete productToMod._id;

            const {statusCode, _body } = await requester.put(`/api/products/${this.productOnDbId}`)
                .send(productToMod);

            expect(statusCode).to.be.ok.and.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/:pid' [PUT]: Modifica un producto", async function(){
            let productToMod = this.productOnDb;
            productToMod.title += ' MOD';
            delete productToMod._id;

            const {statusCode, _body } = await requester.put(`/api/products/${this.productOnDbId}`)
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0])
                .send(productToMod);

            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message).to.be.deep.equal(`Producto modificado exitosamente. ID: ${this.productOnDbId}`);

            const product = await this.productService.getProduct(this.productOnDbId);

            expect(product.title).to.be.deep.equal(productToMod.title);
        })
    
        it("Test de endpoint 'api/products/:pid' [DELETE], sin logearse: Elimina un producto", async function(){
            const {statusCode, _body } = await requester.delete(`/api/products/${this.productOnDbId}`);

            expect(statusCode).to.be.ok.and.deep.equal(401);
            expect(_body.message).to.be.deep.equal('Unauthorized');
        })

        it("Test de endpoint 'api/products/:pid' [DELETE]: Elimina un producto", async function(){
            const {statusCode, _body } = await requester.delete(`/api/products/${this.productOnDbId}`)
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0]);

            expect(statusCode).to.be.deep.equal(200);
            expect(_body.message).to.be.deep.equal(`Producto eliminado exitosamente. ID: ${this.productOnDbId}`);
        })
    })


    describe('Carts: ', ()=>{
        before(async function(){
            this.timeout(5000);

            const adminUser = {
                email: 'admin@gmail.com',
                password: 'admin'
            }

            this.session = await requester.post('/api/sessions/login').send(adminUser);

            this.testCart = await generateCartForReq();
            this.cartOnDbId;
            this.cartOnDb;
        })

        beforeEach(function(){
            this.timeout(5000);
        })
        
        it("Endpoint '/' [POST]: Generar un nuevo carrito", async function(){
            const {statusCode, _body } = await requester.post('/api/carts/').send(this.testCart);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message.includes('El carrito fue agregado con exito. ID: ')).to.be.true;

            this.cartOnDbId = _body.message.replace('El carrito fue agregado con exito. ID: ', '');
        })

        it("Endpoint '/:cid' [GET]: Obtener un carrito", async function(){
            const {statusCode, _body } = await requester.get(`/api/carts/${this.cartOnDbId}`);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(Array.isArray(_body.payload)).to.be.deep.true;

            this.cartOnDb = _body.payload;
        })

        it("Endpoint '/:cid/product/:pid' [POST]: Agregar un producto al carrito", async function(){
            let productId = await getRandomProductOnDB();
            
            const {statusCode, _body } = await requester.post(`/api/carts/${this.cartOnDbId}/product/${productId}`)
                .set('Cookie', this.session.header['set-cookie'][0].split(' ')[0]);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Producto ${productId} cargado con exito al carrito. ID: ${this.cartOnDbId}.`);
        })

        it("Endpoint '/:cid' [PUT]: Modificar los productos de un carrito", async function(){
            let products ={
                products: await generateCartproductsForReq(2)
            }
            
            const {statusCode, _body } = await requester.put(`/api/carts/${this.cartOnDbId}`).send(products);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Carrito modificado con exito. ID: ${this.cartOnDbId}.`);

            const getCarrito = await requester.get(`/api/carts/${this.cartOnDbId}`);

            getCarrito._body.payload.forEach(dbProduct=>{
                expect(products.products.some(product=>product.product === String(dbProduct.product._id))).to.be.deep.true;
            })

            this.cartOnDb = products;
        })

        it("Endpoint '/:cid/product/:pid' [PUT]: Modificar la cantidad de un producto al carrito", async function(){
            const prodToMod = this.cartOnDb.products[0].product;
            const newQty = {
                quantity: 1234
            }

            const {statusCode, _body } = await requester.put(`/api/carts/${this.cartOnDbId}/product/${prodToMod}`).send(newQty);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Se modifico la cantidad del producto ${prodToMod} por 1234. ID: ${this.cartOnDbId}.`);
        })

        it("Endpoint '/:cid/product/:pid' [DELETE]: Eliminar un producto de un carrito", async function(){
            const prodToDelete = this.cartOnDb.products[0].product;
            const {statusCode, _body } = await requester.delete(`/api/carts/${this.cartOnDbId}/product/${prodToDelete}`);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Producto ${prodToDelete} eliminado con exito del carrito. ID: ${this.cartOnDbId}.`);

            const getCarrito = await requester.get(`/api/carts/${this.cartOnDbId}`);

            expect(getCarrito._body.payload.some(dbProduct=>dbProduct.product._id === prodToDelete)).to.be.deep.false;
        })

        it("Endpoint '/:cid' [DELETE]: Eliminar todos los productos de un carrito", async function(){
            const {statusCode, _body } = await requester.delete(`/api/carts/${this.cartOnDbId}`);

            expect(statusCode).to.be.deep.ok;
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Se eliminaron todos los productos del carrito. ID: ${this.cartOnDbId}.`);
        })

        // it("Endpoint '/:cid/purchase' [GET]: Realizar la compra de un carrito", async function(){

        // })

        after(async function(){
            await cartModel.deleteOne({_id:this.cartOnDbId});
        })
    })

    describe('Sessions: ', ()=>{
        before(async function(){
            this.timeout(5000);

            this.userService = new UserService();

            this.testUser = generateUser();
            delete this.testUser.cart;

            this.session;
        })

        beforeEach(function(){
            this.timeout(5000);
        })

        it("Test de endpoint '/register' [post]", async function(){
            const {statusCode, _body } = await requester.post('/api/sessions/register').send(this.testUser);

            expect(statusCode).to.be.deep.ok.and.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Usuario registrado con exito.`);
        })

        it("Test de endpoint '/login' [post]", async function(){
            const loginTestUser = {
                email: this.testUser.email,
                password: this.testUser.password
            }
            const {statusCode, headers, _body } = await requester.post('/api/sessions/login').send(loginTestUser);

            expect(statusCode).to.be.deep.ok.and.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal(`Usuario logueado con exito.`);
            expect(headers['set-cookie']).to.be.deep.ok;
            expect(Array.isArray(headers['set-cookie'])).to.be.deep.true;
            expect(headers['set-cookie'][0].includes('connect.sid=')).to.be.deep.true;

            const user = await this.userService.getUserByEmail(this.testUser.email);

            expect(user.email).to.be.deep.equal(this.testUser.email);
            expect(user.age).to.be.deep.equal(this.testUser.age);

            this.session = headers;
        })

        it("Test de endpoint '/logout' [get]", async function(){
            const {statusCode, headers } = await requester.get('/api/sessions/logout')
                .set('Cookie', [this.session['set-cookie'][0].split(' ')[0]])

            expect(statusCode).to.be.ok.and.deep.equal(302);
            expect(headers.location).to.be.deep.equal('/login?logout=1');
        })

        it("Test de endpoint '/recover' [post]", async function(){
            let user = await this.userService.getUserByEmail(this.testUser.email);
            const recover_body = {
                user: String(user._id),
                new_password: 'nuevaContraseñaTest'
            }
            
            const {statusCode, _body } = await requester.post('/api/sessions/recover').send(recover_body);

            expect(statusCode).to.be.ok.and.deep.equal(200);
            expect(_body.status).to.be.deep.equal('success');
            expect(_body.message).to.be.deep.equal('Contraseña modificada!');
            
            user = await this.userService.getUserByEmail(this.testUser.email);

            expect(isValidPassword(user, recover_body.new_password)).to.be.true;
        })

        after(async function(){
            await userModel.findOneAndDelete({first_name: this.testUser.first_name, last_name: this.testUser.last_name, email: this.testUser.email});
        })

    })
})