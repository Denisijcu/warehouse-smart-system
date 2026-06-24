const User = require('./User');
const Aisle = require('./Aisle');
const Section = require('./Section');
const Supplier = require('./Supplier');
const Product = require('./Product');
const StockMovement = require('./StockMovement');
const Category = require('./Category');      // Si lo creaste
const ProductImage = require('./ProductImage'); // IMPORTANTE

// 🔥 IMPORTAR LA CONEXIÓN (ESTO ES LO QUE FALTABA)
const sequelize = require('../config/db');   // <--- ¡IMPORTANTE!

// Relaciones existentes...
Aisle.hasMany(Section, { foreignKey: 'aisleId' });
Section.belongsTo(Aisle, { foreignKey: 'aisleId' });

Section.hasMany(Product, { foreignKey: 'sectionId' });
Product.belongsTo(Section, { foreignKey: 'sectionId' });

Supplier.hasMany(Product, { foreignKey: 'supplierId' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

Product.hasMany(StockMovement, { foreignKey: 'productId' });
StockMovement.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(StockMovement, { foreignKey: 'userId' });
StockMovement.belongsTo(User, { foreignKey: 'userId' });

// 🔥 NUEVAS RELACIONES PARA IMÁGENES
Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { User, Aisle, Section, Supplier, Product, StockMovement, Category, ProductImage, sequelize };