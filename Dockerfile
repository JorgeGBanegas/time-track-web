# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de paquete y el archivo de bloqueo de paquete a la imagen
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación a la imagen
COPY . .

# Expone el puerto en el que se ejecuta la aplicación en el contenedor
EXPOSE 3000

# Comando para iniciar la aplicación en modo de desarrollo cuando se ejecute el contenedor
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]
