import fs from 'fs';

class CartFsDAO{

  constructor(path){
    this.fs = fs.promises;
    this.path = path;
    this.carts = [];
    this.cartsId = 0;
    
    if(!fs.existsSync(this.path)){
      fs.writeFileSync(this.path, "[]");
    }

    this.loadCarts();
  }

  async exist(cartId){
    let carts = await this.readCarts();
    let exist = carts.some(cart=>cart.cartId == cartId);

    if(!!!exist) throw new Error(`No existe carrito con el ID ${cartId}.`);

    return true;
  }

  async hasProduct(cartId, productId){

    let cart = await this.getCartById(cartId);

    return cart.products.some(product=>product.product == productId);
  }

  async getCarts(){
    return await this.readCarts();
  }

  async getCartById(id){
    await this.loadCarts();

    let exist = this.carts.find(cart=>cart.cartId === id);

    if(!!!exist) throw new Error(`No existe carrito con el ID ${id}.`);

    let cartIndex = this.carts.indexOf(exist);
    return this.carts[cartIndex];
  }

  async addCart(cartToAdd){
    await this.loadCarts();
    
    let exist = this.carts.some(cart => cart.cartId === cartToAdd.cartId);

    if(exist && !!cartToAdd.cartId) throw new Error("El carrito que desea agregar ya existe.");

    this.carts.push({cartId:this.cartsId, ...cartToAdd});
    this.cartsId++;

    this.writeCarts();

    return this.cartsId-1;
  }

  async updateCart(cartId, products){
    let carts = this.getCarts();

    carts.map(cart=>{
      if(cart.cartId == cartId){
        cart.products = products;
      }
    })

    this.carts = carts;

    await this.writeCarts();
  }

  async addProductToCart(cartId, productToAdd){
    let cart = await this.getCartById(cartId);
    let cartIndex = this.carts.indexOf(cart);

    let productExist = cart.products.find(prod => prod.product === productToAdd);

    if(!!productExist){
      let productIndex = cart.products.indexOf(productExist);

      this.carts[cartIndex].products[productIndex].quantity++;
    }else{
      this.carts[cartIndex].products.push({product: productToAdd, quantity:1});
    }

    this.writeCarts();
  }

  async updateProductInCart(cartId, productToUpdate, qty){
    let carts = this.getCarts();
    let updatedCart;

    carts.map(cart=>{
      if(cart.cartId === cartId){
        cart.products.map(prod=>{
          if(prod.product === productToUpdate){
            prod.quantity = qty;
          }
        })
        updatedCart = cart;
      }
    })

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }

  async deleteProductFromCart(cartId, productToDelete){
    let carts = this.getCarts();
    let updatedCart;

    carts.map(cart=>{
      if(cart.cartId===cartId){
        cart.products = cart.products.filter(prod=>prod.product !== productToDelete);
        
        updatedCart = cart;
      }
    })

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }

  async deleteAllProductFromCart(cartId){
    let carts = this.getCarts();
    let updatedCart;

    carts.map(cart=>{
      if(cart.cartId===cartId){
        cart.products = [];
        updatedCart = cart;
      }
    })

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }


  async readCarts(){
    return JSON.parse(await this.fs.readFile(this.path, 'utf-8'));
  }

  async writeCarts(){    
    await this.fs.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
  }

  async loadCarts(){
    this.carts = await this.readCarts();
    this.cartsId = (!!this.carts.length) ? this.carts.reduce((a, b) => (a.cartId > b.cartId) ? a : b ).cartId+1 : 0;
  }
}

export default CartFsDAO;
