import fs from 'fs';

import { __dirname } from '../utils.js';
import config from '../config/config.js';
import ProductsDTO from '../dtos/response/products.res.dto.js';

class ProductFsDAO{

    constructor(){
        this.fs = fs.promises;
        this.path = __dirname+'/fs_persistance/products.json';
        this.products = this.readProducts() || [];
        this.productId = (!!this.products.length) ? this.products.reduce((a, b) => (a.id > b.id) ? a : b ).id+1 : 0;

        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]");
        }
    }

    async getProducts(limit, page, query, sort){
        let productsFileComplete = await this.readProducts();

        const start = ((page-1)*(limit));
        const end = limit;

        let productsFile = productsFileComplete.splice(start, end);

        productsFile = productsFile.filter(prod=>{
            if(query.stock?.$gt && prod.stock <= query.stock.$gt){
                return false;
            }
            if(query.stock?.$gte && prod.stock < query.stock.$gte){
                return false;
            }
            if(query.stock?.$lt && prod.stock >= query.stock.$lt){
                return false;
            }
            if(query.category?.$eq && prod.category !== query.category){
                return false;
            }

            return true;
        })

        productsFile = productsFile.sort((prodA, prodB)=>{
            if(sort<0){
            prodA.price<prodB.price;
            }else{
            prodA.price>prodB.price;
            }
        })

        productsFile.map(prod=>{
            prod._id = prod.id;
            delete prod.id;
        })

        let products = productsFile;
        let totalPages = Math.ceil(productsFileComplete.length/limit);
        let hasPrevPage = (page > 1);
        let hasNextPage = (page < (productsFileComplete.length/limit));
        let prevPage = hasPrevPage ? (page-1) : null;
        let nextPage = hasNextPage ? (page+1) : null;
        let prevLink = hasPrevPage ? `${config.host}:${config.port}/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${JSON.stringify(query)}` : null;
        let nextLink = hasNextPage ? `${config.host}:${config.port}/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${JSON.stringify(query)}` : null;

        let productsToSend = new ProductsDTO({
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        })

        return productsToSend;
    }

    async getProductById(id){
        if(isNaN(id)) throw new Error(`El id indicado no es valido, debe ser numerico. ID ${id}`);

        await this.loadProducts();

        let exist = this.products.find(product=>product.id === Number(id));

        if(!!!exist) throw new Error(`No existe producto con el ID ${id}.`);

        let prodIndex = this.products.indexOf(exist);
        return this.products[prodIndex];
    }

    async addProduct(productToAdd){
        await this.loadProducts();
        let exist = this.products.some(product => product.code === productToAdd.code);

        if(!!exist)
            throw new Error("El producto que desea agregar ya existe.");
        else if(!!!productToAdd.title || !!!productToAdd.description || !!!productToAdd.price || !!!productToAdd.code || !!!productToAdd.stock) 
            throw new Error("No se pudo agregar el producto, debe completar todos los campos.");

        productToAdd.id = this.productId;
        this.products.push(productToAdd);
        this.productId++;

        this.writeProducts();

        return productToAdd;
    }

    async updateProduct(idToUpdate, dataToUpdate){
        if(isNaN(idToUpdate)) throw new Error(`El id indicado no es valido, debe ser numerico. ID ${idToUpdate}`);

        await this.loadProducts()

        let productToUpdate = this.products.find(prod => prod.id === Number(idToUpdate));

        if(!!!productToUpdate) throw new Error(`Imposible actualizar. No existe producto con el ID ${idToUpdate}`);
        if(!!dataToUpdate.id) throw new Error(`Imposible actualizar. Intento modificar el ID por ${dataToUpdate.id}, no puede modificar este dato del producto.`)

        let productIndex = this.products.indexOf(productToUpdate);
        this.products[productIndex] = {...productToUpdate, ...dataToUpdate};

        this.writeProducts();
    }

    async deleteProduct(idToDelete){
        if(isNaN(idToDelete)) throw new Error(`El id indicado no es valido, debe ser numerico. ID ${idToDelete}`);

        await this.loadProducts()

        let productToDelete = this.products.find(prod => prod.id === Number(idToDelete));

        if(!!!productToDelete) throw new Error(`Imposible eliminar. No existe producto con el ID ${idToDelete}`)

        let productIndex = this.products.indexOf(productToDelete);
        this.products.splice(productIndex, 1);

        this.writeProducts();
    }


    async readProducts(){
        return JSON.parse(await this.fs.readFile(this.path, 'utf-8'));
    }

    async writeProducts(){
        await this.fs.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
    }

    async loadProducts(){
        this.products = await this.readProducts();
        this.productId = (!!this.products.length) ? this.products.reduce((a, b) => (a.id > b.id) ? a : b ).id+1 : 0;
    }
}

export default ProductFsDAO;
