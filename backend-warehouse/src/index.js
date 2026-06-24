const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // 🛡️ IMPORTANTE: Asegúrate de requerir 'path'
require('dotenv').config();

const sequelize = require('./config/db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());

const corsOptions = {
  // ✅ Quitamos la barra final de la URL de Netlify
  origin: ['https://vertex-sm-warehouse.netlify.app', 'https://warehouse-smart-system-production.up.railway.app'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

// =======================================================
// 🛡️ SERVIDOR DE ESTÁTICOS GLOBAL (Bypass de Helmet)
// =======================================================
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 🔴 ESTA es la llave maestra que desactiva el bloqueo de Helmet para las imágenes:
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(process.cwd(), 'uploads'))); // Resolución dinámica estándar
// =======================================================

// Rutas
app.use('/api', routes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

// Iniciar servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar DB:', err);
  });