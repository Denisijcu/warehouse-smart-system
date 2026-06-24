# Usar una imagen oficial de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app/backend-warehouse

# Copiar package.json y package-lock.json (ahora están en la ruta correcta)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]