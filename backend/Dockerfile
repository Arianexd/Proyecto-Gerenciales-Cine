# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código del backend
COPY . .

# Expone el puerto que usa el backend
EXPOSE 3000

# Comando para iniciar la aplicación (usa npm start que corre node server.js)
CMD ["npm", "start"]
