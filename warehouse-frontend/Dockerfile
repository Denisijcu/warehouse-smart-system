# Usar una imagen oficial de Node.js para construir el frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build -- --configuration production

# ----------------------------
# Servir la app con Nginx
# ----------------------------
FROM nginx:alpine

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /app/dist/warehouse-frontend/browser /usr/share/nginx/html

# Copiar una configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]