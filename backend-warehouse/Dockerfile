# Usar una imagen oficial de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo en la raíz de la aplicación
WORKDIR /app

# Copiar package.json y package-lock.json (están en la carpeta actual)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (src, routes, controllers, etc.)
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]