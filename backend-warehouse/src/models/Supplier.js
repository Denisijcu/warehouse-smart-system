const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  taxId: { type: DataTypes.STRING, unique: true }
});

module.exports = Supplier;