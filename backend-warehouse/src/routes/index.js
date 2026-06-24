const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const aisleController = require('../controllers/aisleController');
const sectionController = require('../controllers/sectionController');
const supplierController = require('../controllers/supplierController');
const movementController = require('../controllers/movementController');
const chatController = require('../controllers/chatController');

// Importar el modelo de Imágenes (para usarlo en los endpoints)
//const { Product, ProductImage } = require('../models');
const { User, Product, ProductImage } = require('../models');


const upload = require('../middlewares/upload'); // Importar la configuración de multer

const router = express.Router();

// ============ AUTH ============
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ============ PRODUCTOS ============
router.get('/products', authMiddleware, productController.getAll);
router.get('/products/:id', authMiddleware, productController.getById);
router.get('/products/aisle/:aisleId', authMiddleware, productController.getByAisle);
router.post('/products', authMiddleware, roleMiddleware(['admin']), productController.create);
router.put('/products/:id', authMiddleware, roleMiddleware(['admin']), productController.update);
router.patch('/products/:id/stock', authMiddleware, productController.updateStock);
router.delete('/products/:id', authMiddleware, roleMiddleware(['admin']), productController.delete);

// ============ PASILLOS ============
router.get('/aisles', authMiddleware, aisleController.getAll);
router.get('/aisles/:id', authMiddleware, aisleController.getById);
router.post('/aisles', authMiddleware, roleMiddleware(['admin']), aisleController.create);
router.put('/aisles/:id', authMiddleware, roleMiddleware(['admin']), aisleController.update);
router.delete('/aisles/:id', authMiddleware, roleMiddleware(['admin']), aisleController.delete);

// ============ SECCIONES ============
router.get('/sections', authMiddleware, sectionController.getAll);
router.get('/sections/aisle/:aisleId', authMiddleware, sectionController.getByAisle);
router.get('/sections/:id', authMiddleware, sectionController.getById);
router.post('/sections', authMiddleware, roleMiddleware(['admin']), sectionController.create);
router.put('/sections/:id', authMiddleware, roleMiddleware(['admin']), sectionController.update);
router.delete('/sections/:id', authMiddleware, roleMiddleware(['admin']), sectionController.delete);

// ============ PROVEEDORES ============
router.get('/suppliers', authMiddleware, supplierController.getAll);
router.get('/suppliers/:id', authMiddleware, supplierController.getById);
router.post('/suppliers', authMiddleware, roleMiddleware(['admin']), supplierController.create);
router.put('/suppliers/:id', authMiddleware, roleMiddleware(['admin']), supplierController.update);
router.delete('/suppliers/:id', authMiddleware, roleMiddleware(['admin']), supplierController.delete);

// ============ MOVIMIENTOS ============
router.get('/movements', authMiddleware, movementController.getAll);
router.get('/movements/product/:productId', authMiddleware, movementController.getByProduct);
router.get('/movements/date-range', authMiddleware, movementController.getByDateRange);

// ============ CHATBOT ============
router.post('/chat', authMiddleware, chatController.chat);

// ============================================================
// 🖼️ ENDPOINTS DE IMÁGENES (Múltiples y única)
// ============================================================

// 1. Subir una sola imagen (para compatibilidad con versiones anteriores)
router.post('/products/:id/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    await product.update({ imageUrl });

    res.json({ message: 'Imagen subida exitosamente', imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Subir múltiples imágenes (Hasta 10) para un producto
router.post('/products/:id/images', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const imageUrls = req.files.map(file => ({
      productId: product.id,
      imageUrl: `http://localhost:3000/uploads/${file.filename}`,
      isMain: false,
      order: 0
    }));

    // Si no hay imagen principal, la primera se convierte en principal
    const existingMain = await ProductImage.findOne({ where: { productId: product.id, isMain: true } });
    if (!existingMain && imageUrls.length > 0) {
      imageUrls[0].isMain = true;
    }

    const created = await ProductImage.bulkCreate(imageUrls);
    res.json({ message: 'Imágenes subidas exitosamente', images: created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Obtener todas las imágenes de un producto
router.get('/products/:id/images', authMiddleware, async (req, res) => {
  try {
    const images = await ProductImage.findAll({
      where: { productId: req.params.id },
      order: [['isMain', 'DESC'], ['order', 'ASC']]
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ============ USUARIOS (SOLO ADMIN) ============
// Obtener todos los usuarios (solo admin)
router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'role', 'isActive'] 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo usuario (solo admin)
router.post('/users', authMiddleware, roleMiddleware(['admin']), authController.register);

// Actualizar un usuario (solo admin)
router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // Si se envía una contraseña, el hook de Sequelize la encriptará automáticamente
    await user.update(req.body);
    
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;