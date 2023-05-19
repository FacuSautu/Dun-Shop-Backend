import { faker } from "@faker-js/faker/locale/es";

import ProductDTO from "../../dtos/response/product.res.dto.js";

export const generateProduct = ()=>{
    return new ProductDTO({
        _id: faker.string.alphanumeric(10),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(5),
        price: faker.number.int({min:150, max:10500}),
        status: true,
        stock: faker.number.int({min: 5, max: 2500}),
        category: faker.commerce.department(),
        thumbnails: [faker.image.url()],
        owner: '642f6163797edba02f02a463'
    })
}

export const generateProducts = qty=>{
    const products = [];

    for (let i = 0; i < qty; i++) {
        products.push(generateProduct());
    }

    return products;
}