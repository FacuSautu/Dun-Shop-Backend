
# Dun-shop Backend

Y de entre el montón de edificaciones... encuentran una un tanto particular, su estructura estable y bien cuidada, con una buena iluminación exterior, la cual es opacada únicamente por la que proviene del interior.

En su frente, la adorna una hermosa puerta revestida de roble adornada con unas juntas doradas, y en su cenit algo logra captar su atención... logran identificar un cartel, el cual dice:

*"Bienvenidos a Dun-shop"*

*"Ahora con tienda virtual!"*


## Descripción
Dun-shop es Backend de un e-commerce desarrollado para el **Curso de Backend de CoderHouse**. 
Dicho proyecto esta hecha en base a un almacén general común y corriente que uno se puede encontrar dentro del universo de *Dungeons & Dragons*, 
en el cual se pueden encontrar desde armas a armaduras, pociones, objetos mágicos y mucho mas!

El proyecto consta de la logica detras de cualquier e-commerce, la cual realiza la gestion de productos, armado de carritos, checkout de compras, etc.
## Instalación

1. Clonar el repositorio.

```bash
  git clone https://github.com/FacuSautu/Dun-Shop-Backend.git
  cd Dun-Shop-Backend
```
2. Instalar dependencias.
```bash
  npm install
```
3. Correr el servidor.
```bash
  npm start
```
4. Correrlo en modo development.
```bash
  npm start-dev
```
En este modo el proyecto se lanzara utilizando *nodemon*, permitiendo una dinamica de relanzamiento al modificar los archivos.
## API Reference

### Products
#### Get all products

```http
  GET /api/products
```
```
{
    status: <String> Estado del response (success/error),
    payload: <Product>[] Array con el resultado de productos,
    message: <String> Mensaje informativo (Solo para estado de error)
}
```

___
#### Get product

```http
  GET /api/products/${pid}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `pid`     | `string` | **Requerido**. Id del producto a obtener |

- #### Response
```
{
    status: <String> Estado del response (success/error),
    payload: <Product> Objeto con los datosdel productos,
    message: <String> Mensaje informativo (Solo para estado de error)
}
```

___
#### Add product

```http
  POST /api/products
```
- #### JSON Body
```
{
    title: <String> Titulo del producto,
    description: <String> Descripcion del producto,
    code: <String> Codigo del producto,
    price: <Number> Precio del producto,
    status: <Boolean> Estado del producto,
    stock: <Number> Cantidad en stock,
    category: <String> Categoria del producto
}
```

- #### Response
```
{
    status: <String> Estado del response (success/error),
    message: <String> Mensaje informativo
}
```

___
#### Update product

```http
  PUT /api/products/${pid}
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `pid`     | `string` | **Requerido**. Id del producto a modificar |

- #### JSON Body
```
{
    title: <String> Titulo modificado del producto,
    description: <String> Descripcion modificada del producto,
    code: <String> Codigo modificado del producto,
    price: <Number> Precio modificado del producto,
    status: <Boolean> Estado modificado del producto,
    stock: <Number> Cantidad modificada en stock,
    category: <String> Categoria modificada del producto
}
```
No es necesario mandar todos los datos del producto, pueden enviarse solo los datos que se desean modificar.

- #### Response
```
{
    status: <String> Estado del response (success/error),
    message: <String> Mensaje informativo
}
```

___
#### Eliminar product

```http
  DELETE /api/products/${pid}
```

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `pid`     | `string` | **Requerido**. Id del producto a eliminar |

- #### Response
```
{
    status: <String> Estado del response (success/error),
    message: <String> Mensaje informativo
}
```

### Cart
#### Get cart

```http
  GET /api/carts/${cid}
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a obtener |

- #### Response
```
{
    status: <String> Estado del response (success/error),
    payload: <CartProduct>[] Array con los productos del carrito,
    message: <String> Mensaje informativo
}
```

___
#### Add cart

```http
  POST /api/carts
```

- #### JSON Body
```
{
    "products": <CartProduct>[] Array con datos de los productos (solo Id del producto y cantidad en carrito),
}
```

- #### Response
```
{
    status: <String> Estado del response (success/error),
    message: <String> Mensaje informativo
}
```

___
#### Add product to cart

```http
  POST /api/carts/:cid/product/:pid
```
| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a agregar el producto |
| `pid`     | `string` | **Requerido**. Id del producto a agregar            |

- #### Response
```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```
## Authors

- [@FacuSautu](https://github.com/FacuSautu)
## Tech Stack

**Servidor:** Node.JS, Express JS, Handlebars

**Protocolos de comunicación:** HTTP, WebSocket

**Persistencia:** File System
## Dependencias

[![express](https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67)](https://expressjs.com/)
___
*Express JS* es la dependencia core para el proyecto, ya que es el motor utilizado para armar la estructura basica de backend. 
Dicha libreria ofrece todas las comodidades para el lanzamiento de un servidor en Node JS, el armado de rutas, manejo de sesiones, etc.
___
___
___
[![express-handlebars](https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/handlebars-js.png?fit=500%2C500&ssl=1&resize=350%2C200)](https://www.npmjs.com/package/express-handlebars)
___
*Handlebars* es el motor de plantilla utilizado en el proyecto, con la ayuda de esta dependencia se logra renderizar vistas con información dinámica para la presentación de información útil (como el listado de productos existentes en el e-commerce).
___
___
___
[![socket.io](https://miro.medium.com/max/1200/1*tOitxCwTNcS3ESstLylmtg.png)](https://www.npmjs.com/package/socket.io)
___
*Socket.io* es un paquete para gestión de protocolo WebSocket. La implementación dentro del proyecto sirve para ofrecerle a los clientes del servicio un canal de comunicación bidireccional en el que pueden recibir actualizaciones sobre carga de productos nuevos en tiempo real o novedades del e-commerce en general (Así como nuevas ofertas o promociones).

### Dependencias Dev
[![nodemon](https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png)](https://www.npmjs.com/package/nodemon)
___
*Nodemon* es una herramienta de desarrollador utilizada en aplicaciones Node.JS capaz de re-ejecutar una aplicacion Node al detectar cambios en los archivos.
Decidi utilizar esta herramienta para el proyecto por la utilidad y el dinamismo que ofrece al momento de desarrollar aplicaciones web.