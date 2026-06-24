¡Perfecto, hermano! Aquí tienes el **`README.md` profesional** para la raíz de tu proyecto (`F:\warehouse\README.md`). 

Este README está diseñado para **impresionar a cualquier reclutador, cliente o inversor** que visite tu repositorio de GitHub. Incluye la arquitectura, el stack tecnológico, cómo correrlo y capturas de pantalla.

---

## 📄 `README.md` (Copia y pega esto en `F:\warehouse\README.md`)

```markdown
# 🏢 Warehouse AI — Sistema de Gestión de Inventario Inteligente

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Angular](https://img.shields.io/badge/Angular-19-red)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)

> **Un sistema de inventario y logística de élite, diseñado para almacenes tipo Home Depot.**  
> Con Inteligencia Artificial, Búsqueda por Voz, Visor 3D, Múltiples imágenes por producto y un sistema de Roles de Usuario (Admin, Operador, Invitado).

---

## 📸 Capturas de pantalla

| Dashboard | Tienda (Carruseles) |
|-----------|---------------------|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+KPI+Cards) | ![Tienda](https://via.placeholder.com/400x200?text=Tienda+Carruseles+Temu) |

| Detalle del producto (3D + Mapa) | Asistente IA (Chatbot) |
|--------------------------------|------------------------|
| ![Detalle](https://via.placeholder.com/400x200?text=Detalle+Carrusel+Mapa+3D) | ![Chatbot](https://via.placeholder.com/400x200?text=Chatbot+WareAI) |

> **Nota:** Reemplaza los enlaces de `via.placeholder.com` con las capturas reales de tu sistema para que el README se vea profesional.

---

## 🚀 Características principales

### 📦 Gestión de Inventario (CRUD)
- ✅ CRUD completo de productos (Crear, Leer, Actualizar, Eliminar).
- ✅ Organización por **Pasillos** y **Secciones**.
- ✅ Filtros por pasillo y búsqueda por nombre/SKU.
- ✅ **Búsqueda por voz** (Web Speech API) — di el nombre y la tabla se filtra.
- ✅ Alertas visuales de **stock bajo** (color rojo).

### 🖼️ Múltiples imágenes por producto
- ✅ Subida de **hasta 10 imágenes** por producto.
- ✅ Almacenamiento local en carpeta `uploads/` y servidas estáticamente.
- ✅ Carrusel de miniaturas en la página de detalle.

### 🗺️ Smart Home Depot (Sin carrito)
- ✅ La tienda **no tiene carrito de compras** — solo muestra la ubicación exacta del producto.
- ✅ Página de detalle con **mapa de ubicación**: Pasillo, Sección y Proveedor.
- ✅ Botón **"Ver en el mapa del almacén"** para guiar al cliente.

### 🤖 Inteligencia Artificial (Chatbot)
- ✅ **WareAI**: Asistente conversacional con contexto en tiempo real.
- ✅ Integración con **Claude API (Anthropic)**.
- ✅ Responde preguntas sobre inventario, stock bajo y movimientos.
- ✅ Acceso a la base de datos para dar respuestas precisas.

### 👥 Gestión de Usuarios y Roles
- ✅ **Tres roles**: Admin, Operador e Invitado (Guest).
- ✅ El **Guest** solo puede ver la Tienda y el Asistente IA.
- ✅ CRUD completo de usuarios desde el panel de administración.

### 📊 Dashboard y Reportes
- ✅ KPI Cards en tiempo real: Total productos, Stock total, Proveedores.
- ✅ Gráfico de barras por pasillo y distribución circular (Chart.js).
- ✅ Tabla de movimientos recientes (entradas y salidas).

### 🛒 Tienda & Catálogo (Estilo Temu)
- ✅ **Carruseles horizontales**: Ofertas relámpago, Destacados.
- ✅ **Carrusel vertical** de Recién Llegados.
- ✅ **Categorías** visuales con iconos (Herramientas, Pinturas, etc.).
- ✅ Página de detalle con **visor 3D** (Three.js) integrado.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Angular 19 (Standalone, Signals, Vite) |
| **Backend** | Node.js, Express, Sequelize |
| **Base de datos** | PostgreSQL 17 |
| **IA / Chatbot** | Claude API (Anthropic), Web Speech API |
| **Visualización 3D** | Three.js, OrbitControls |
| **Estilos** | Tailwind CSS, SCSS |
| **Seguridad** | JWT, Helmet, CORS, CORP |
| **Almacenamiento** | Multer (subida de archivos) |
| **Containerización** | Docker, Docker Compose |

---

## 🏗️ Arquitectura del Proyecto

```
warehouse/
├── backend-warehouse/           # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── models/              # Modelos de Sequelize
│   │   ├── routes/              # Endpoints de la API
│   │   ├── middlewares/         # Auth, upload, CORS
│   │   ├── seeders/             # Datos de prueba
│   │   └── index.js             # Punto de entrada
│   ├── uploads/                 # Imágenes subidas
│   └── .env                     # Variables de entorno
│
└── warehouse-frontend/          # Frontend Angular 19
    ├── src/
    │   ├── app/
    │   │   ├── core/            # Servicios, guards, interceptores
    │   │   ├── features/        # Módulos (dashboard, inventory, etc.)
    │   │   ├── shared/          # Componentes reutilizables
    │   │   └── layout/          # Sidebar y layout global
    │   └── environments/        # Configuración de entornos
    └── ...
```

---

## 🚀 Instalación y Ejecución

### 📦 Prerrequisitos
- Node.js v18+
- PostgreSQL 17+
- Angular CLI (`npm install -g @angular/cli`)
- Docker Desktop (opcional, para despliegue)

### 🔧 Backend (Modo desarrollo)
```bash
cd backend-warehouse
npm install
cp .env.example .env   # Configura tus credenciales
node src/seeders/seed.js   # Poblar base de datos con datos de prueba
npm start
```

### 🌐 Frontend (Modo desarrollo)
```bash
cd ../warehouse-frontend
npm install
ng serve
```

### 🔑 Credenciales de acceso
- **Admin:** `admin@warehouse.com` / `admin123`
- **Guest:** `guest@warehouse.com` / `guest123` (Solo tienda)

---

## 🐳 Despliegue con Docker (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up --build -d

# Detener todos los servicios
docker-compose down
```

**Acceso:**
- Frontend: `http://localhost`
- Backend API: `http://localhost:3000/api`
- Base de datos: `localhost:5432` (user: `postgres`, pass: `admin123`)

---

## 📡 Endpoints principales de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Iniciar sesión (JWT) |
| `GET` | `/api/products` | Obtener todos los productos |
| `POST` | `/api/products` | Crear un producto |
| `POST` | `/api/products/:id/images` | Subir múltiples imágenes |
| `GET` | `/api/users` | Obtener todos los usuarios (Admin) |
| `POST` | `/api/chat` | Conversar con el chatbot WareAI |

---

## 🧠 Reconocimientos

Este proyecto fue diseñado y desarrollado por **[Denis Sanchez Leyva]** como parte de una visión estratégica para modernizar la gestión de inventarios en almacenes tipo Home Depot, integrando inteligencia artificial, diseño de élite y experiencia de usuario de primer nivel.

---

## 📜 Licencia

Este proyecto es de uso exclusivo del cliente. No está permitida su distribución sin autorización expresa.

---

## 📞 Contacto

Para más información o soporte técnico, contacta a:
**Denis Sanchez Leyva**  
📧 denisjcu266@gmail.com

---

> **"Warehouse AI" — No solo gestionas inventario, vendes experiencias.**
```

---

## ✅ ¿Qué sigue?

1. **Toma capturas de pantalla** de tu sistema (Dashboard, Tienda, Detalle, Chatbot).
2. **Sustituye los placeholders** del README por las imágenes reales.
3. **Haz el commit y push** del README:

```bash
git add README.md
git commit -m "📄 Agregado README.md profesional"
git push
```

---
