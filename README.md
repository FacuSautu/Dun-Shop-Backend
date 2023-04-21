
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
  npm run dev
```
En este modo el proyecto se lanzara utilizando *nodemon*, permitiendo una dinamica de relanzamiento al modificar los archivos.

___
El proyecto acepta ciertas variables por linea de comando al iniciar el proyecto, el formato del comando de lanzamiento seria el siguiente:

```bash
  npm run dev -- -d -p <port> --mode <mode> --persistance <persistance>
```

- `-d:` Variable de Debug, para realizar los testing correspondientes del proyecto.
- `-p <port>:` Puerto en el que se lanzara el proyecto (si no se le indica uno tomara el que esta en el archivo `.env`).
- `--mode <mode>:` Modo en el que se lanzara el proyecto, puede ser `development` o `production` (si no se le indica uno tomara `production` por default).
- `--persistance <persistance>:` El motor de persistencia que se desea utilizar, puede ser `mongo` o `fs` (si no se le indica uno tomara el que esta en el archivo `.env`).

## Environment Variables

Para poder correr este proyecto se deben completar las siguientes variables de entorno en los archivos ".env.development" y ".env.production" respectivamente para cada modo.


`HOST:` Direccion host donde se alojara el proyecto (localhost por default).

`PORT:` Puerto donde se levantara el proyecto.

`LOGIN_STRATEGY:` Estrategia de logueo a utilizar (Puede ser `SESSION` o `JWT`).

`PERSISTANCE_ENGINE:` Motor de persistencia a utilizar (Puede ser `MONGO` o `FS`).

`MONGO_URL:` URL para coneccion con mongo.

`GITHUB_APP_ID:` ID de aplicacion de Github, para estrategia de logueo con Github.

`GITHUB_CLIENT_ID:` ID de cliente de Github, para estrategia de logueo con Github.

`GITHUB_CLIENT_SECRET:` Secreto de Github, para estrategia de logueo con Github.

`GITHUB_CALLBACK_URL:` URL de callback llamada cuando se loguea con Github.

`JWT_PRIVATE_KEY:` Key privada para el hasheo de JWT.

`GOOGLE_APP_PASSWORD:` Contraseña de aplicacion de google para el envio de mails desde Gmail.

`TWILIO_ACCOUNT_SID:` ID de cuenta de Twilio, para envio de SMS.

`TWILIO_AUTH_TOKEN:` Token de autenticacion de Twilio, para envio de SMS.

`TWILIO_SMS_NUMBER:` Numero a utilizar para el envio de SMS.

## API Reference

### Products
#### Get all products

```http
  GET /api/products
```
- **Query params**

| Parameter | Type     | Description                                | Valores posibles                                             |
| :-------- | :------- | :----------------------------------------- | :----------------------------------------------------------- |
| `limit`   | `number` | Numero de los registros por pagina.        |                                                              |
| `page`    | `number` | Numero de pagina que se quiere visualizar. |                                                              |
| `sort`    | `number` | Tipo de ordenamiento deseado por precio.   | 1: Ordenamiento ascendente.<br>-1: Ordenamiento descendente. |
| `query`   | `JSON`   | Filtros a aplicar a la busqueda.           | stock: Filta productos con o sin stock (1 o 0)<br>maxStock: Filtra por productos con menor stock.<br>minStock: Filtra por productos con mayor stock.<br>category: Filtra productos por la categoria enviada. |

- **Response**

```
{
    status: <String> Estado del response (success/error),
    payload: <Product>[] Array con el resultado de productos,
    totalPages: <Number> Cantidad de paginas,
    prevPage: <Number> Pagina anterior,
    nextPage: <Number> Pagina siguiente,
    page: <Number> Pagina actual,
    hasPrevPage: <Boolean> Tiene pagina anterior?,
    hasNextPage: <Boolean> Tiene pagina siguiente?,
    prevLink: <String || null> URL para obtener la anterior pagina,
    nextLink: <String || null> URL para obtener la siguiente pagina
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


- **Response**

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

- **JSON Body**

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

- **Response**

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


- **JSON Body**

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

- **Response**

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

- **Response**

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

- **Response**

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

- **JSON Body**

```
{
    "products": <CartProduct>[] Array con datos de los productos (solo Id del producto y cantidad en carrito),
}
```

- **Response**

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

- **Response**

```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```

___
#### Update cart

```http
  PUT /api/carts/:cid
```
- **URL Params**

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a agregar el producto |

- **Body**

```
{
    products: [
        {
            product: <String> ID del producto,
            quantity: <Number> Cantidad del producto
        }
    ]
}
```
- **Response**

```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```

___
#### Update product in cart

```http
  PUT /api/carts/:cid/product/:pid
```
- **URL Params**

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a agregar el producto |
| `pid`     | `string` | **Requerido**. Id del producto a agregar            |

- **Body**

```
{
    quantity: <Number> Cantidad del producto
}
```

- **Response**

```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```

___
#### Delete product in cart

```http
  DELETE /api/carts/:cid/product/:pid
```

- **URL Params**

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a agregar el producto |
| `pid`     | `string` | **Requerido**. Id del producto a agregar            |

- **Response**

```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```

___
#### Delete all products in cart

```http
  DELETE /api/carts/:cid
```
- **URL Params**

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `cid`     | `string` | **Requerido**. Id del carrito a agregar el producto |

- **Response**

```
{
    status: <String> Estado del response (success),
    message: <String> Mensaje informativo
}
```

### Sessions
#### Registro de usuario

```http
  POST /api/sessions/register
```
- **Body**

```
{
    first_name: <String> Nombre del usuario,
    last_name: <String> Apellido del usuario,
    email: <String> E-Mail,
    age: <Number> Edad,
    password: <String> Contraseña
}
```

- **Response**

Redireccióna al formulario de login.
___
#### Login de usuario

```http
  POST /api/sessions/login
```
- **Body**

```
{
    email: <String> E-Mail de usuario,
    password: <String> Contraseña de usuario
}
```

- **Response**

**Encontro usuario:** Redireccióna al listado de productos.
**No se encontro usuario:** Redireccióna al formulario de login.
___
#### Logout de usuario

```http
  GET /api/sessions/logout
```

- **Response**

Redireccióna al formulario de login.
___

### Views
#### Lista de productos

```http
  GET /products
```
- **Query params**

| Parameter | Type     | Description                                | Posibles valores                                             |
| :-------- | :------- | :----------------------------------------- | :----------------------------------------------------------- |
| `limit`   | `number` | Numero de los registros por pagina.        |                                                              |
| `page`    | `number` | Numero de pagina que se quiere visualizar. |                                                              |
| `sort`    | `number` | Tipo de ordenamiento deseado por precio.   | 1: Ordenamiento ascendente.<br>-1: Ordenamiento descendente. |
| `query`   | `JSON`   | Filtros a aplicar a la busqueda.           | stock: Filta productos con o sin stock (1 o 0)<br>maxStock: Filtra por productos con menor stock.<br>minStock: Filtra por productos con mayor stock.<br>category: Filtra productos por la categoria enviada. |
 
- **Response**

Devuelve una listado de los productos implementando la paginación de los mismos.

___
#### Detalle de producto

```http
  GET /products/:pid
```
- **URL params**

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| `pid`     | `string` | ID del producto a mostrar |
 
- **Response**

Devuelve el detalle de un producto en especifico.

___
#### Listado de productos en tiempo real

```http
  GET /realtimeproducts
```
 
- **Response**

Devuelve un listado de los productos implementando WebSocket para poder mostrar cambios en tiempo real.

___
#### Detalle de Carrito

```http
  GET /carts/:cid
```
- **URL params**

| Parameter | Type     | Description              |
| :-------- | :------- | :----------------------- |
| `cid`     | `string` | ID del carrito a mostrar |
 
- **Response**

Devuelve un listado de los productos dentro de un carrito, así como otros datos propios del carrito.

___
#### Formulario de registro

```http
  GET /register
```

- **Response**

Devuelve un formulario de registro de usuarios.

___
#### Formulario de login

```http
  GET /login
```

- **Response**

Devuelve un formulario de login de usuarios.

___
#### Perfil de usuario

```http
  GET /profile
```

- **Response**

Devuelve una vista con información del usuario que esta logueado.

___
#### Chat

```http
  GET /chat
```
 
- **Response**

Devuelve un chat interno para poder mantener comunicación con otros usuarios del proyecto.

## Authors

- [@FacuSautu](https://github.com/FacuSautu)
## Tech Stack

**Servidor:** Node.JS, Express JS

**Protocolos de comunicación:** HTTP, WebSocket

**Vistas:** Handlebars, Bootstrap, Font Awesome, Sweet Alert 2

**Persistencia:** File System, MongoDB

**Utilitarios:** Multer

## Dependencias

<a href="https://expressjs.com/" target="_blank"><img src="https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" height="200px" /></a>
___
*Express JS* es la dependencia core para el proyecto, ya que es el motor utilizado para armar la estructura basica de backend. 
Dicha libreria ofrece todas las comodidades para el lanzamiento de un servidor en Node JS, el armado de rutas, manejo de sesiones, etc.
___
___
<a href="https://www.npmjs.com/package/express-session" target="_blank"><img src="https://i.ytimg.com/vi/OH6Z0dJ_Huk/maxresdefault.jpg" height="200px" /></a>
___
*Express-session* es una libreria encargada de gestionar las sesiones de usuarios implementando el uso de cookies.
___
___
<a href="https://nodejs.org/api/fs.html#file-system" target="_blank"><img src="https://miro.medium.com/max/707/1*PPvVl5iTR0Nhn1QFL7X_CA.png" height="200px" /></a>
___
*fs* es la librería utilizada en el proyecto para realizar la persistencia de datos. Esta librería permite gestionar archivos del sistema, dando así la posibilidad de generar archivos JSON donde almacenar los datos utilizados en la aplicación.
___
___
<a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://miro.medium.com/max/1050/1*acfAKaDI7uv5GyFnJmiPhA.png" height="200px" /></a>
___
*Mongoose* es la libreria que funciona como interfaz para poder administrar bases de datos MongoDB desde Java Script. Esta libreria permite mantener una persistencia de los datos en dicha base de datos.
___
___
<a href="https://www.npmjs.com/package/mongoose-paginate-v2" target="_blank"><img src="https://raw.githubusercontent.com/aravindnc/mongoose-paginate-v2/HEAD/static/banner.jpg" height="200px" /></a>
___
*Mongoose-paginate-v2* es un plugin de Mongoose que permite realizar paginacion de registros al momento de hacer consultas. Dando la posibilidad de seleccionar el limite maximo de registros por pagina, la pagina que se desea ver, ordenamiento de los datos, filtrado, etc.
___
___
<a href="https://www.npmjs.com/package/connect-mongo" target="_blank"><img src="https://miro.medium.com/max/1050/1*acfAKaDI7uv5GyFnJmiPhA.png" height="200px" /></a>
___
*Connect-mongo* es la librería encargada de almacenar las sesiones existentes en el servidor en una base de datos Mongo.
___
___
<a href="https://www.npmjs.com/package/bcrypt" target="_blank"><img src="https://stackjava.com/wp-content/uploads/2018/03/bcrypt-logo.jpg" height="200px" /></a>
___
*bcrypt* es un paquete para el hasheo de contraseñas, utilizado en el proyecto para la seguridad de las credenciales de los usuarios que se registren.
___
___
<a href="https://www.npmjs.com/package/passport" target="_blank"><img src="https://antoniofernandez.com/assets/blog/passportjs.png" height="200px" /></a>
___
*passport* es un paquete de gestion de estrategias de autenticacion y autorizacion. Para este proyecto se estan usando estrategias para registro y loqueo de usuarios de forma local, utilizando GitHub o con JWT, con los paquetes de: passport-local, passport-github2 y passport-jwt.
___
___
<a href="https://www.npmjs.com/package/cookie-parser" target="_blank"><img src="https://www.section.io/engineering-education/client-side-auth-with-express-cookie-parser/hero.png" height="200px" /></a>
___
*cookie-parser* permite administrar las cookies que utilizara el proyecto con los diferentes clientes. Para este proyecto se esta utilizando para mantener sesiones utilizando JWT.
___
___
<a href="https://www.npmjs.com/package/jsonwebtoken" target="_blank"><img src="https://i.imgur.com/qDOOu4o.jpeg" height="200px" /></a>
___
*jsonwebtoken* es la libreria encargada de generar y autenticar sesiones utilizando JWT para mantener vivas dichas sesiones.
___
___
<a href="https://www.npmjs.com/package/express-handlebars" target="_blank"><img src="https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/handlebars-js.png?fit=500%2C500&ssl=1&resize=350%2C200" height="200px" /></a>
___
*Handlebars* es el motor de plantilla utilizado en el proyecto, con la ayuda de esta dependencia se logra renderizar vistas con información dinámica para la presentación de información útil (como el listado de productos existentes en el e-commerce).
___
___
<a href="https://www.npmjs.com/package/socket.io" target="_blank"><img src="https://miro.medium.com/max/1200/1*tOitxCwTNcS3ESstLylmtg.png" height="200px" /></a>
___
*Socket.io* es un paquete para gestión de protocolo WebSocket. La implementación dentro del proyecto sirve para ofrecerle a los clientes del servicio un canal de comunicación bidireccional en el que pueden recibir actualizaciones sobre carga de productos nuevos en tiempo real o novedades del e-commerce en general (Así como nuevas ofertas o promociones).
___
___
<a href="https://www.npmjs.com/package/multer" target="_blank"><img src="https://user-images.githubusercontent.com/6388707/66124653-463a2d00-e5e5-11e9-8fed-b5bca26b66ea.png" height="200px" /></a>
___
*Multer* es un paquete de middleware para manejo de datos `multipart/form-data`, normalmente utilizado para manejo de archivos enviados por HTTP. Este utilitario permite en el proyecto almacenar las imagenes de los productos que se quieren cargar, para asi poder mostrarlos desde las vistas donde se listan los productos.
___
___
<a href="https://www.npmjs.com/package/dotenv" target="_blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvBqX2kKRb9ek5RJ470wjOX9pUgTaX8CIeUcLLi-o43nGLPeAQsnopvWuoIrFw77SogUA&usqp=CAU" height="200px" /></a>
___
*dotenv* se encarga de la gestion de variables de entorno. Dando la posibilidad de utilizar diferentes entornos del proyecto y tambien mantener seguros los datos sensibles utilizados en el mismo.
___
___
<a href="https://www.npmjs.com/package/commander" target="_blank"><img src="https://miro.medium.com/v2/resize:fit:1400/1*m_Hk0OyZFipUvDT84WtBQA.png" height="200px" /></a>
___
*commander* permite gestionar las variables admitidas por linea de comando al inicializar el proyecto, haciando que se puedan setear diferentes variables de forma mas dinamica para diferentes lanzamientos del proyecto.
___
___
<a href="https://www.npmjs.com/package/nodemailer" target="_blank"><img src="https://i0.wp.com/community.nodemailer.com/wp-content/uploads/2015/10/n2-2.png?fit=422%2C360&ssl=1" height="200px" /></a>
___
*nodemailer* da la posibilidad de enviar emails utilizando diferentes servicios de mensajeria. Para este proyecto se utilizara el servicio de GMail para el envio de correos electronicos.
___
___
<a href="https://www.npmjs.com/package/twilio" target="_blank"><img src="https://www.chetu.com/img/twilio/partner/twilio-logo.png" height="200px" /></a>
___
*twilio* es la libreria encargada de gestionar el envio de mensajeria por SMS.

### Dependencias Dev
<a href="https://www.npmjs.com/package/nodemon" target="_blank"><img src="https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png" height="200px" /></a>
___
*Nodemon* es una herramienta de desarrollador utilizada en aplicaciones Node.JS capaz de re-ejecutar una aplicacion Node al detectar cambios en los archivos.
Decidi utilizar esta herramienta para el proyecto por la utilidad y el dinamismo que ofrece al momento de desarrollar aplicaciones web.