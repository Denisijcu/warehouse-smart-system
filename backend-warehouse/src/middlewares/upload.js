const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🛡️ Hardening: Ruta absoluta para evitar carpetas huérfanas
//const uploadDir = path.join(__dirname, '../uploads');
const uploadDir = path.join(process.cwd(), 'uploads');

// Crear el directorio si no existe (previene crasheos en el primer despliegue)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp + random + extensión original saneada
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // 🛡️ Hardening: Lista Blanca Estricta (MIME + Extensión)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const ext = path.extname(file.originalname).toLowerCase();
  
  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    // Rechazo silencioso a nivel de middleware
    cb(new Error('Archivo no autorizado. Solo se permiten imágenes válidas (JPG, PNG, WEBP, GIF)'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 10 // Limita a un máximo de 10 archivos por petición para evitar DoS
  } 
});

module.exports = upload;