import mongoose from 'mongoose';

import productModel from './models/product.model.js';
import ProductsDTO from '../dtos/response/products.res.dto.js';
import ProductDTO from '../dtos/response/product.res.dto.js';

import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { invalidId, idCantChange, missingData } from '../services/errors/info/generic.error.info.js';
import { productNotFound, productAlreadyExist } from '../services/errors/info/products.error.info.js';

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
            prevLink: (productsDb.hasPrevPage) ? `/products?limit=${limit}&page=${productsDb.prevPage}&sort=${sort}&query=${JSON.stringify(query)}` : null,
            nextLink: (productsDb.hasNextPage) ? `/products?limit=${limit}&page=${productsDb.nextPage}&sort=${sort}&query=${JSON.stringify(query)}` : null
        })

        return products;
    }

    async getProductById(id){
        if(!mongoose.Types.ObjectId.isValid(id)) 
            CustomError.createError({
                name: "ID de producto no valido",
                cause: invalidId(id, 'ObjectId'),
                message: "El valor enviado no corresponde a un ID valido",
                code: EErrors.GENERICS.ID_TYPE_NOT_VALID
            });

        let exist = await productModel.exists({_id: id});

        if(!!!exist) 
            CustomError.createError({
                name: "No existe producto",
                cause: productNotFound(id),
                message: `No existe producto con el ID ${id}.`,
                code: EErrors.PRODUCTS.PRODUCT_NOT_FOUND
            });

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
            thumbnails: productDb.thumbnails,
            owner: productDb.owner
        });

        return productDTO;
    }

    async addProduct(productToAdd){
        let exist = await productModel.exists(productToAdd);

        if(exist)
            CustomError.createError({
                name: "Producto ya existe",
                cause: productAlreadyExist(),
                message: "El producto que desea agregar ya existe.",
                code: EErrors.PRODUCTS.PRODUCT_EXIST
            });
        else if(!!!productToAdd.title || !!!productToAdd.description || !!!productToAdd.price || !!!productToAdd.code || !!!productToAdd.stock) 
            CustomError.createError({
                name: "Faltan Datos",
                cause: missingData(productToAdd, {
                    title: "Titulo",
                    description: "Descripcion",
                    price: 100,
                    code: "Codigo",
                    stock: 20,
                }),
                message: "No se pudo agregar el producto, debe completar todos los campos.",
                code: EErrors.GENERICS.MISSING_REQUIRED_DATA
            });

        return productModel.create(productToAdd);
    }

    async updateProduct(idToUpdate, dataToUpdate){
        if(!mongoose.Types.ObjectId.isValid(idToUpdate))
            CustomError.createError({
                name: "ID de producto no valido",
                cause: invalidId(idToUpdate, 'ObjectId'),
                message: "El valor enviado no corresponde a un ID valido",
                code: EErrors.GENERICS.ID_TYPE_NOT_VALID
            });

        let exist = await productModel.exists({_id: idToUpdate});

        if(!!!exist)
            CustomError.createError({
                name: "Producto no existe",
                cause: productNotFound(idToUpdate),
                message: `Imposible actualizar. No existe producto con el ID ${idToUpdate}`,
                code: EErrors.PRODUCTS.PRODUCT_NOT_FOUND
            });
        if(!!dataToUpdate._id)
            CustomError.createError({
                name: "No se puede modificar ID",
                cause: idCantChange(),
                message: `Imposible actualizar. Intenta modificar el ID por ${dataToUpdate._id}, no puede modificar este dato del producto.`,
                code: EErrors.GENERICS.ID_CANT_CHANGE
            });

        return productModel.updateOne({_id:idToUpdate}, dataToUpdate);
    }

    async deleteProduct(idToDelete){
        if(!mongoose.Types.ObjectId.isValid(idToDelete))
            CustomError.createError({
                name: "ID de producto no valido",
                cause: invalidId(idToDelete, 'ObjectId'),
                message: "El valor enviado no corresponde a un ID valido",
                code: EErrors.GENERICS.ID_TYPE_NOT_VALID
            });

        let exist = await productModel.exists({_id: idToDelete});

        if(!!!exist)
            CustomError.createError({
                name: "Producto no existe",
                cause: productNotFound(idToDelete),
                message: `Imposible eliminar. No existe producto con el ID ${idToDelete}`,
                code: EErrors.PRODUCTS.PRODUCT_NOT_FOUND
            });

        return productModel.deleteOne({_id:idToDelete});
    }
}


export default ProductDbDAO;