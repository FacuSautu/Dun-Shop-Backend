import { faker } from "@faker-js/faker";

import ProductController from "../../controllers/products.controller.js";
import CartDTO from '../../dtos/response/cart.res.dto.js';
import CartProductDTO from '../../dtos/cartProduct.dto.js';
import { generateProduct } from "./products.mock.js";

faker.locale = 'es';

const productController = new ProductController();

// ============ RESPONSE ============

export const generateCartProduct = ()=>{
    return new CartProductDTO({
        product:generateProduct(),
        quantity: faker.random.numeric(2)
    })
}

export const generateCartproducts = qty=>{
    let cartProducts = [];

    for (let i = 0; i < qty; i++) {
        cartProducts.push(generateCartProduct());
    }

    return cartProducts;
}

export const generateCart = ()=>{
    return new CartDTO({
        _id: faker.random.alphaNumeric(10),
        products: generateCartproducts(Math.random()*20)
    })
}

export const generateCarts = qty=>{
    let carts = [];

    for (let i = 0; i < qty; i++) {
        carts.push(generateCart());
    }

    return carts;
}

// ============ REQUEST ============

export const generateCartProductForReq = async ()=>{
    const products = await productController.getProducts({limit:1000});
    const productsId = products.products.map(product=>String(product._id))

    return new CartProductDTO({
        product:productsId[Math.floor(Math.random()*productsId.length)],
        quantity: faker.random.numeric(2)
    })
}

export const generateCartproductsForReq = async (qty=10)=>{
    let cartProducts = [];

    for (let i = 0; i < qty; i++) {
        let productToAdd = await generateCartProductForReq();
        
        
        let exist;
        cartProducts.forEach((product, index)=>{
            console.log("DATOS: ", product, index);
        })
        // if(!!exist){
        //     cartProducts[cartProducts.indexOf(exist)]
        // }
        cartProducts.push();
    }

    return cartProducts;
}

export const generateCartForReq = ()=>{
    return new CartDTO({
        _id: faker.random.alphaNumeric(10),
        products: generateCartproducts(Math.random()*20)
    })
}

export const generateCartsForReq = qty=>{
    let carts = [];

    for (let i = 0; i < qty; i++) {
        carts.push(generateCart());
    }

    return carts;
}