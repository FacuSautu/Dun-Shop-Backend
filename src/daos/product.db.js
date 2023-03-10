import mongoose from 'mongoose';
import productModel from './models/product.model.js';

class ProductDB{

    constructor(){}

    getProducts(limit, page, query, sort){
        return productModel.paginate(query, {limit, page, sort:{price:sort}, lean: true});
    }

    async getProductById(id){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new Error('El valor enviado no corresponde a un ID valido');

        let exist = await productModel.exists({_id: id});

        if(!!!exist) throw new Error(`No existe producto con el ID ${id}.`);

        return productModel.findById(id);
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


export default ProductDB;