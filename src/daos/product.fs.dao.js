import fs from 'fs';

class ProductFsDAO{

    constructor(path){
    this.fs = fs.promises;
    this.path = path;
    this.products = this.readProducts() || [];
    this.productId = (!!this.products.length) ? this.products.reduce((a, b) => (a.id > b.id) ? a : b ).id+1 : 0;

    if(!fs.existsSync(this.path)){
        fs.writeFileSync(this.path, "[]");
    }
    }

    async getProducts(limit, page, query, sort){
        let products = await this.readProducts();

        const start = ((page-1)*(limit));
        const end = limit;

        products = products.splice(start, end);

        products = products.filter(prod=>{
            if(query.stock.$gt && prod.stock <= query.stock.$gt){
                return false;
            }
            if(query.stock.$gte && prod.stock < query.stock.$gte){
                return false;
            }
            if(query.stock.$lt && prod.stock >= query.stock.$lt){
                return false;
            }
            if(query.category.$eq && prod.category !== query.category){
                return false;
            }

            return true;
        })

        products = products.sort((prodA, prodB)=>{
            if(sort<0){
            prodA.price<prodB.price;
            }else{
            prodA.price>prodB.price;
            }
        })

        return products;
    }

    async getProductById(id){
        await this.loadProducts();

        let exist = this.products.find((product)=>product.id === id);

        if(!!!exist) throw new Error(`No existe producto con el ID ${id}.`);

        let prodIndex = this.products.indexOf(exist);
        return this.products[prodIndex];
    }

    async addProduct(productToAdd){
    await this.loadProducts();
    let exist = this.products.some(product => product.code === productToAdd.code);

    if(exist)
        throw new Error("El producto que desea agregar ya existe.");
    else if(!!!productToAdd.title || !!!productToAdd.description || !!!productToAdd.price || !!!productToAdd.code || !!!productToAdd.stock) 
        throw new Error("No se pudo agregar el producto, debe completar todos los campos.");

    this.products.push({id:this.productId, ...productToAdd});
    this.productId++;

    this.writeProducts();

    return this.productId-1;
    }

    async updateProduct(idToUpdate, dataToUpdate){
    await this.loadProducts()

    let productToUpdate = this.products.find(prod => prod.id === idToUpdate);

    if(!!!productToUpdate) throw new Error(`Imposible actualizar. No existe producto con el ID ${idToUpdate}`);
    if(!!dataToUpdate.id) throw new Error(`Imposible actualizar. Intento modificar el ID por ${dataToUpdate.id}, no puede modificar este dato del producto.`)

    let productIndex = this.products.indexOf(productToUpdate);
    this.products[productIndex] = {...productToUpdate, ...dataToUpdate};

    this.writeProducts();
    }

    async deleteProduct(idToDelete){
    await this.loadProducts()

    let productToDelete = this.products.find(prod => prod.id === idToDelete);

    if(!!!productToDelete) throw new Error(`Imposible eliminar. No existe producto con el ID ${idToDelete}`)

    let productIndex = this.products.indexOf(productToDelete);
    this.products.splice(productIndex, 1);

    this.writeProducts();
    }


    async readProducts(){
    let productsFile = await this.fs.readFile(this.path, 'utf-8');
    return JSON.parse(productsFile);
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
