const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
  minStock: { type: DataTypes.INTEGER, defaultValue: 5 },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  sectionId: { type: DataTypes.INTEGER, allowNull: false },
  supplierId: { type: DataTypes.UUID, allowNull: false },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
});


module.exports = Product;