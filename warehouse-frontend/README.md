
```markdown
# 🏢 Warehouse AI — Sistema de Gestión de Inventario Inteligente

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Angular](https://img.shields.io/badge/Angular-19-red)
![Node.js](https://img.shields.io/badge/Node.js-24-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)

> **Un sistema de inventario y e-commerce de élite, diseñado para almacenes tipo Home Depot.**  
> Con inteligencia artificial, búsqueda por voz, múltiples imágenes por producto y carruseles estilo Temu.

---

## 📸 Capturas de pantalla

| Dashboard | Tienda |
|-----------|--------|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+KPI+Cards) | ![Tienda](https://via.placeholder.com/400x200?text=Tienda+Carruseles) |

| Detalle del producto | Chatbot IA |
|---------------------|------------|
| ![Detalle](https://via.placeholder.com/400x200?text=Detalle+Carrusel+Mapa) | ![Chatbot](https://via.placeholder.com/400x200?text=Chatbot+WareAI) |

*(Reemplaza los enlaces de `via.placeholder.com` con las capturas reales de tu sistema).*

---

## 🚀 Características principales

### 📦 Gestión de Inventario
- ✅ CRUD completo de productos (Crear, Leer, Actualizar, Eliminar).
- ✅ Organización por **Pasillos** y **Secciones**.
- ✅ Filtros por pasillo y búsqueda por nombre/SKU.
- ✅ **Búsqueda por voz** (Web Speech API) — di el nombre del producto y la tabla se filtra.
- ✅ Alertas visuales de **stock bajo** (color rojo).

### 🤝 Gestión de Proveedores
- ✅ CRUD completo de proveedores.
- ✅ Asignación de proveedores a productos.

### 📊 Dashboard Inteligente
- ✅ KPI Cards en tiempo real: Total productos, Stock total, Proveedores activos.
- ✅ Gráfico de barras de productos por pasillo (Chart.js).
- ✅ Tabla de movimientos recientes (entradas y salidas).

### 🛒 Tienda & Catálogo
- ✅ **Carruseles horizontales** estilo Temu: Ofertas relámpago, Destacados.
- ✅ **Carrusel vertical** de Recién Llegados.
- ✅ **Categorías** visuales con iconos (Herramientas, Pinturas, Materiales, etc.).
- ✅ **Múltiples imágenes por producto** (hasta 10 imágenes por producto).
- ✅ Página de detalle con **carrusel de miniaturas** y **visor 3D** (Three.js).

### 🗺️ Smart Home Depot
- ✅ La tienda no tiene carrito de compras — **solo muestra la ubicación exacta del producto**.
- ✅ Página de detalle con **mapa de ubicación**: Pasillo, Sección y Proveedor.
- ✅ Botón **"Ver en el mapa del almacén"** para guiar al cliente.

### 🤖 Inteligencia Artificial (Chatbot)
- ✅ **WareAI**: Asistente conversacional con contexto en tiempo real.
- ✅ Integración con **Claude API (Anthropic)**.
- ✅ Responde preguntas sobre inventario, stock bajo y movimientos.
- ✅ Acceso a la base de datos para dar respuestas precisas.

### 🖼️ Subida de Imágenes
- ✅ Subida de **múltiples imágenes** por producto.
- ✅ Almacenamiento local en carpeta `uploads/`.
- ✅ Servicio estático con CORS y CORP configurados para visualización segura.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Angular 19 (Standalone, Signals, Vite) |
| **Backend** | Node.js, Express, Sequelize |
| **Base de datos** | PostgreSQL 17 |
| **IA / Chatbot** | Claude API (Anthropic), Web Speech API |
| **Visualización 3D** | Three.js, OrbitControls |
| **Estilos** | Bootstrap 5, SCSS |
| **Seguridad** | JWT, Helmet, CORS, CORP |
| **Almacenamiento** | Multer (subida de archivos) |
| **Despliegue** | Docker, Railway / Vercel (en producción) |

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

### 🔧 Backend
```bash
cd backend-warehouse
npm install
cp .env.example .env   # Configura tus credenciales
node src/seeders/seed.js   # Poblar base de datos con datos de prueba
npm start
```

### 🌐 Frontend
```bash
cd ../warehouse-frontend
npm install
ng serve --port 4200
```

### 🔑 Credenciales de acceso
- **Admin:** `admin@warehouse.com` / `admin123`
- **Operador:** (crea uno desde el registro)

---

## 📡 Endpoints principales de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Iniciar sesión (JWT) |
| `GET` | `/api/products` | Obtener todos los productos |
| `POST` | `/api/products` | Crear un producto |
| `POST` | `/api/products/:id/images` | Subir múltiples imágenes |
| `GET` | `/api/aisles` | Obtener todos los pasillos |
| `GET` | `/api/suppliers` | Obtener todos los proveedores |
| `POST` | `/api/chat` | Conversar con el chatbot WareAI |

---

## 🧪 Pruebas rápidas

1. Inicia sesión con el admin.
2. Crea un producto desde el modal de inventario (sube varias imágenes).
3. Ve a la tienda y haz clic en "Ver producto".
4. Observa el carrusel de imágenes, el mapa de ubicación y prueba el botón de "Ver en el mapa".
5. Abre el chatbot y pregúntale: *"¿Cuántos productos tengo en total?"*

---

## 🧠 Reconocimientos

Este proyecto fue diseñado y desarrollado por **[Tu Nombre]** como parte de una visión estratégica para modernizar la gestión de inventarios en almacenes tipo Home Depot, integrando inteligencia artificial, diseño de élite y experiencia de usuario de primer nivel.

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


