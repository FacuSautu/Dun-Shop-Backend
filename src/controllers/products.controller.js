import ProductService from "../services/products.service.js";

class ProductController{
    constructor(){
        this.productService = new ProductService();
    }

    async getProducts(limit=10, page=1, query='{}', sort=1){
        const products = await this.productService.getProducts(limit, page, query, sort);

        products.prevLink= products.hasPrevPage && `localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`;
        products.nextLink= products.hasNextPage && `localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`;

        return products;
    }

    getProduct(id){
        return this.productService.getProduct(id);
    }

    addProduct(product){
        return this.productService.addProduct(product);
    }

    updateProduct(id, newData){
        return this.productService.updateProduct(id, newData);
    }

    deleteProduct(id){
        return this.productService.deleteProduct(id);
    }
}

export default ProductController;