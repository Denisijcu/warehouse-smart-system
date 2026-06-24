# Usar una imagen oficial de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]