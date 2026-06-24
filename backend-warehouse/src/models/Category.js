
// src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING, allowNull: false } // emoji o URL de icono
});

module.exports = Category;