import productModel from './models/product.model';

class ProductDao{
    constructor(){
        this.model = new productModel();
    }

    getProducts(){
        return this.model.find();
    }

    getProductById(id){
        return this.model.findOne({"_id": id});
    }

    addProduct(productToAdd){
        return this.model.insertOne(productToAdd);
    }

    addProducts(productsToAdd){
        return this.model.insertMany(productsToAdd);
    }

    async updateProduct(idToUpdate, dataToUpdate){
    return this.model.updateOne({"_id": idToUpdate, dataToUpdate});
    }

    async deleteProduct(idToDelete){
    await this.loadProducts()

    let productToDelete = this.products.find(prod => prod.id === idToDelete);

    if(!!!productToDelete) throw new Error(`Imposible eliminar. No existe producto con el ID ${idToDelete}`)

    let productIndex = this.products.indexOf(productToDelete);
    this.products.splice(productIndex, 1);

    this.writeProducts();
    }
}