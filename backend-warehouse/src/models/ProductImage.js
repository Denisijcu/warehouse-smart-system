const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  isMain: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = ProductImage;