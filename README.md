
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

Para la documentacion completa de la API y sus endpoint siga los pasos para la instalacion del proyecto, corralo y acceda a la direccion `${HOST}:${PUERTO}/apidocs`.

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
<a href="https://www.npmjs.com/package/express-compression" target="_blank"><img src="https://opengraph.githubassets.com/6350c3ed714c0adf5cf05924ee2d2538a4312250da5f6045ad3d9e344d8e2507/expressjs/compression" height="200px" /></a>
___
*Express-compression* agrega al proyecto la posibilidad de comprimir las respuestas de cada endpoint para optimizar los tiempos de envio de datos.
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
___
___
<a href="https://www.npmjs.com/package/winston" target="_blank"><img src="https://avatars.githubusercontent.com/u/9682013?s=280&v=4" height="200px" /></a>
___
*Winston* es la libreria utilizada para realizar logs de registros. Con la implementacion de esta herramienta se pudo agregar al proyecto un sistema de logs por diferentes transportes (Consola, archivo de texto, etc.).
___
___
<a href="https://www.npmjs.com/package/swagger-ui-express" target="_blank"><img src="https://i.morioh.com/210419/43c049dd.webp" height="200px" /></a>
___
*Swagger-ui-express* permite generar documentación de una forma rápida y dinámica a través de un archivo de configuración. Con esta herramienta se pudo desplegar una documentación visual de los diferentes endpoints del proyecto de una forma veloz y fácil de entender.
___
___
<a href="https://www.npmjs.com/package/swagger-jsdoc" target="_blank"><img src="https://spin.atomicobject.com/wp-content/uploads/swagger-logo-1.jpg" height="200px" /></a>
___
*Swagger-jsdoc* agrega al proyecto la posibilidad de implementar anotations dentro del código para que se auto-genere documentación del mismo, de igual manera permite la creación de archivos externos de configuración para que la librería `swagger-ui-express` pueda interpretar y generar la documentación.

### Dependencias Dev
<a href="https://www.npmjs.com/package/nodemon" target="_blank"><img src="https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png" height="200px" /></a>
___
*Nodemon* es una herramienta de desarrollador utilizada en aplicaciones Node.JS capaz de re-ejecutar una aplicacion Node al detectar cambios en los archivos.
Decidi utilizar esta herramienta para el proyecto por la utilidad y el dinamismo que ofrece al momento de desarrollar aplicaciones web.
___
___
<a href="https://www.npmjs.com/package/artillery" target="_blank"><img src="https://avatars.githubusercontent.com/u/12608521?s=280&v=4" height="200px" /></a>
___
*Artillery* es una libreria para testeo de carga, la cual permite realizar testeo de consultas masivas a la API para obtener estadisticas de diferentes parametros clave de performance del proyecto.
___
___
<a href="https://www.npmjs.com/package/artillery-plugin-metrics-by-endpoint" target="_blank"><img src="https://opengraph.githubassets.com/a547287c83eba12ab3eafde0f0b8cf3c6a3d9e2c521f0d4532e029bad48413a2/artilleryio/artillery-plugin-metrics-by-endpoint" height="200px" /></a>
___
*Artillery-plugin-metrics-by-endpoint* es un plugin de Artillery el cual permite obtener estadisticas mas completas de los test realizados con dicha libreria y agrega la posibilidad de exportar los resultados a un archivo externo.
___
___
<a href="https://www.npmjs.com/package/@faker-js/faker" target="_blank"><img src="https://fakerjs.dev/social-image.png" height="200px" /></a>
___
*Faker* es una libreria para generar datos de testing de cualquier tipo, esta herramienta se implementa en el proyecto para ofrecer endpoints de testeo los cuales generan datos mock para su uso en los test unitarios del proyecto.
___
___
<a href="https://www.npmjs.com/package/mocha" target="_blank"><img src="https://www.vectorlogo.zone/logos/mochajs/mochajs-ar21.png" height="200px" /></a>
___
*Mocha* permite generar archivos de testing para codigo JavaScript de forma dinamica, generando un entorno para cada testing y dando la posibilidad de chequear los resultados para definir si son satisfactorios o no.
___
___
<a href="https://www.npmjs.com/package/chai" target="_blank"><img src="https://www.vectorlogo.zone/logos/chaijs/chaijs-ar21.png" height="200px" /></a>
___
*Chai* es una libreria de assertions para utilizar en testing, ofreciendo una forma mas amigable y dinamica de chequear resultados de testing para confirmar si los mismos cumples con los requisitos del test.
___
___
<a href=" https://www.npmjs.com/package/supertest" target="_blank"><img src="https://camo.githubusercontent.com/fcca6a233a54a037861c99ab17d255d215807e6c0fcdce7d16a1a67814ede820/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6d656469612d702e736c69642e65732f75706c6f6164732f3333383935382f696d616765732f313439363334352f7375706572746573742e706e67" height="200px" /></a>
___
*Supertest* lleva la gestion de testing a un nivel superior, permitiendo generar testing mas riguroso de forma mas simple. En este proyecto se utiliza a la par con Mocha y Chai para el testeo de endpoints especificos.