import mongoose from 'mongoose';

import config from '../config/config.js';
import productModel from './models/product.model.js';
import ProductsDTO from '../dtos/response/products.res.dto.js';
import ProductDTO from '../dtos/response/product.res.dto.js';

class ProductDbDAO{

    constructor(){}

    async getProducts(limit, page, query, sort){
        const productsDb = await productModel.paginate(query, {limit, page, sort:{price:sort}, lean: true});

        let products = new ProductsDTO({
            products: productsDb.docs,
            totalPages: productsDb.totalPages,
            prevPage: productsDb.prevPage,
            nextPage: productsDb.nextPage,
            page: productsDb.page,
            hasPrevPage: productsDb.hasPrevPage,
            hasNextPage: productsDb.hasNextPage,
            prevLink: (productsDb.hasPrevPage) ? `${config.host}:${config.port}/api/products?limit=${limit}&page=${productsDb.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: (productsDb.hasNextPage) ? `${config.host}:${config.port}/api/products?limit=${limit}&page=${productsDb.nextPage}&sort=${sort}&query=${query}` : null
        })

        return products;
    }

    async getProductById(id){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new Error('El valor enviado no corresponde a un ID valido');

        let exist = await productModel.exists({_id: id});

        if(!!!exist) throw new Error(`No existe producto con el ID ${id}.`);

        let productDb = await productModel.findById(id).lean();

        let productDTO = new ProductDTO({
            _id: productDb._id,
            title: productDb.title,
            description: productDb.description,
            code: productDb.code,
            price: productDb.price,
            status: productDb.status,
            stock: productDb.stock,
            category: productDb.category,
            thumbnails: productDb.thumbnails
        });

        console.log(productDTO);

        return productDTO;
    }

    async addProduct(productToAdd){
        let exist = await productModel.exists(productToAdd);

        if(exist)
            throw new Error("El producto que desea agregar ya existe.");
        else if(!!!productToAdd.title || !!!productToAdd.description || !!!productToAdd.price || !!!productToAdd.code || !!!productToAdd.stock) 
            throw new Error("No se pudo agregar el producto, debe completar todos los campos.");

        return productModel.create(productToAdd);
    }

    async updateProduct(idToUpdate, dataToUpdate){
        if(!mongoose.Types.ObjectId.isValid(idToUpdate)) throw new Error('El valor enviado no corresponde a un ID valido');

        let exist = await productModel.exists({_id: idToUpdate});

        if(!!!exist) throw new Error(`Imposible actualizar. No existe producto con el ID ${idToUpdate}`);
        if(!!dataToUpdate._id) throw new Error(`Imposible actualizar. Intenta modificar el ID por ${dataToUpdate._id}, no puede modificar este dato del producto.`);

        return productModel.updateOne({_id:idToUpdate}, dataToUpdate);
    }

    async deleteProduct(idToDelete){
        if(!mongoose.Types.ObjectId.isValid(idToDelete)) throw new Error('El valor enviado no corresponde a un ID valido');

        let exist = await productModel.exists({_id: idToDelete});

        if(!!!exist) throw new Error(`Imposible eliminar. No existe producto con el ID ${idToDelete}`)

        return productModel.deleteOne({_id:idToDelete});
    }
}


export default ProductDbDAO;