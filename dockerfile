# Se levanta imagen base de Docker.
FROM node

# Creacion de directorio de trabajo.
WORKDIR /app

# Copiado del archivo package.json al directorio de trabajo.
COPY package.json ./

# Se instalan las dependencias.
RUN npm i

# Copiamos lo instalado al directorio de trabajo.
COPY . .

# Se expone el puerto que va a estar escuchando.
EXPOSE 8080

# Se ejecuta el comando de lanzamiento del proyecto.
CMD ["npm", "start"]