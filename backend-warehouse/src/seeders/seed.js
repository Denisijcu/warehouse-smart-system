const { User, Aisle, Section, Supplier, Product, StockMovement, ProductImage } = require('../models');
const sequelize = require('../config/db');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('🔄 Base de datos reiniciada');

  // Usuario admin
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@warehouse.com',
    password: 'admin123',
    role: 'admin'
  });

  // Usuario Guest (para clientes)
  await User.create({
    name: 'Cliente Invitado',
    email: 'guest@warehouse.com',
    password: 'guest123',
    role: 'guest'
  });

  // Pasillos
  const aisle1 = await Aisle.create({ name: 'Pasillo A', description: 'Herramientas' });
  const aisle2 = await Aisle.create({ name: 'Pasillo B', description: 'Pinturas' });

  // Secciones
  const sectionA1 = await Section.create({ name: 'A-1', aisleId: aisle1.id });
  const sectionA2 = await Section.create({ name: 'A-2', aisleId: aisle1.id });
  const sectionB1 = await Section.create({ name: 'B-1', aisleId: aisle2.id });

  // Proveedores
  const supplier1 = await Supplier.create({
    name: 'Proveedor XYZ',
    email: 'contacto@xyz.com',
    phone: '555-1234',
    taxId: '123456789'
  });

  const supplier2 = await Supplier.create({
    name: 'Materiales SA',
    email: 'ventas@materiales.com',
    phone: '555-5678',
    taxId: '987654321'
  });

  // Productos
  const products = await Product.bulkCreate([
    {
      sku: 'HERR-001',
      name: 'Martillo 16oz',
      quantity: 50,
      minStock: 10,
      price: 15.99,
      sectionId: sectionA1.id,
      supplierId: supplier1.id
    },
    {
      sku: 'HERR-002',
      name: 'Destornillador Phillips',
      quantity: 80,
      minStock: 20,
      price: 8.50,
      sectionId: sectionA1.id,
      supplierId: supplier1.id
    },
    {
      sku: 'PINT-001',
      name: 'Pintura blanca 4L',
      quantity: 30,
      minStock: 5,
      price: 22.00,
      sectionId: sectionB1.id,
      supplierId: supplier2.id
    }
  ]);

  // 🖼️ Imágenes de ejemplo para los productos
  await ProductImage.bulkCreate([
    {
      productId: products[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1504145554044-1f1f9b0c5f8a?w=600&h=600&fit=crop&crop=center',
      isMain: true,
      order: 0
    },
    {
      productId: products[1].id,
      imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=600&fit=crop&crop=center',
      isMain: true,
      order: 0
    },
    {
      productId: products[2].id,
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&crop=center',
      isMain: true,
      order: 0
    }
  ]);

  // Movimientos iniciales
  await StockMovement.bulkCreate([
    { productId: products[0].id, quantity: 50, type: 'in', reason: 'Inventario inicial', userId: admin.id },
    { productId: products[1].id, quantity: 80, type: 'in', reason: 'Inventario inicial', userId: admin.id },
    { productId: products[2].id, quantity: 30, type: 'in', reason: 'Inventario inicial', userId: admin.id }
  ]);

  console.log('✅ Datos de prueba insertados');
}

seed().catch(console.error);