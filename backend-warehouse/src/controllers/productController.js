const { Product, Section, Supplier, StockMovement, Aisle, User, ProductImage, sequelize } = require('../models'); // 🛡️ Añadido User

// 🛡️ Helper de Seguridad
const getUserId = (req) => {
  return req.user?.id || req.user?.userId || req.userId || req.user?.sub;
};

// 🛡️ Helper de Arquitectura
const sanitizeProduct = (product) => {
  const p = product.toJSON();
  return {
    ...p,
    section: p.Section || p.section || null,
    supplier: p.Supplier || p.supplier || null
  };
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Section, include: [{ model: Aisle, attributes: ['id', 'name'] }] },
        { model: Supplier },
        { model: ProductImage, attributes: ['id', 'imageUrl', 'isMain', 'order'] } // <--- AGREGA ESTO
      ]
    });
    res.json(products.map(sanitizeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Section, include: [{ model: Aisle }] },
        { model: Supplier },
        { model: ProductImage, attributes: ['id', 'imageUrl', 'isMain', 'order'] } // <--- AGREGA ESTO
      ]
    });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(sanitizeProduct(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByAisle = async (req, res) => {
  try {
    const aisleId = req.params.aisleId;
    const products = await Product.findAll({
      include: [{ model: Section, where: { aisleId } }, { model: Supplier }]
    });
    res.json(products.map(sanitizeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  // ==========================================
  // 🔴 TRAMPA DE DIAGNÓSTICO VERTEX
  // ==========================================
  console.log("\n=== 🔴 DIAGNÓSTICO DE INSERCIÓN ===");
  console.log("1. Payload del Token (req.user):", req.user);
  
  const userId = getUserId(req);
  console.log("2. ID extraído:", userId);
  
  if (!userId) {
    console.log("❌ FALLO: No hay ID en el token. Falta middleware.");
    return res.status(401).json({ error: 'Operación denegada: ID de usuario no rastreable' });
  }

  try {
    // Verificamos si el usuario realmente existe en la BD para evitar el error de Foreign Key
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      console.log(`❌ FALLO: El ID ${userId} no existe en la tabla Users (Token fantasma).`);
      return res.status(401).json({ error: 'Token Fantasma: El usuario ya no existe. Cierra sesión y vuelve a entrar.' });
    }
    console.log("3. Integridad referencial: OK (Usuario existe).");
  } catch (dbError) {
    console.log("❌ FALLO CRÍTICO DE BD al buscar usuario:", dbError.message);
    return res.status(500).json({ error: 'Error de tipos en BD. Revisa si User.id es INTEGER y StockMovement.userId es UUID.' });
  }
  console.log("=================================\n");
  // ==========================================

  const t = await sequelize.transaction();
  try {
    const { sku, name, description, sectionId, supplierId, quantity, minStock, price } = req.body;
    
    if (!sku || !name || !sectionId || !supplierId) {
      throw new Error('Faltan campos obligatorios para registrar el producto');
    }

    const product = await Product.create({
      sku, name, description, sectionId, supplierId, 
      minStock: minStock || 5,
      price: price || 0,
      quantity: quantity || 0
    }, { transaction: t });

    await StockMovement.create({
      productId: product.id,
      quantity: quantity || 0,
      type: 'in',
      reason: 'Inventario inicial',
      userId: userId
    }, { transaction: t });

    await t.commit();
    
    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: Section, include: [{ model: Aisle, attributes: ['id', 'name'] }] },
        { model: Supplier }
      ]
    });

    res.status(201).json(sanitizeProduct(fullProduct));
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const { sku, name, description, sectionId, supplierId, minStock, price } = req.body;
    const updateData = {};
    if (sku) updateData.sku = sku;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sectionId) updateData.sectionId = sectionId;
    if (supplierId) updateData.supplierId = supplierId;
    if (minStock !== undefined) updateData.minStock = minStock;
    if (price !== undefined) updateData.price = price;

    await product.update(updateData);
    
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Section }, { model: Supplier }]
    });

    res.json(sanitizeProduct(updatedProduct));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  if (!sequelize) return res.status(500).json({ error: 'Error interno: sequelize no definido' });

  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Operación denegada: ID de usuario no rastreable' });

  const t = await sequelize.transaction();
  try {
    const { quantity, type, reason } = req.body;
    if (!quantity || quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
    if (!['in', 'out'].includes(type)) throw new Error('Tipo de movimiento inválido');

    const product = await Product.findByPk(req.params.id, { transaction: t });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const newQuantity = type === 'in' ? product.quantity + quantity : product.quantity - quantity;
    if (newQuantity < 0) return res.status(400).json({ error: 'Stock insuficiente para esta operación' });

    await product.update({ quantity: newQuantity }, { transaction: t });
    
    await StockMovement.create({
      productId: product.id,
      quantity,
      type,
      reason: reason || 'Movimiento manual',
      userId: userId
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    
    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};