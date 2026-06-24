const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockMovement = sequelize.define('StockMovement', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('in', 'out', 'adjustment'), allowNull: false },
  reason: { type: DataTypes.STRING },
  userId: { type: DataTypes.UUID, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = StockMovement;