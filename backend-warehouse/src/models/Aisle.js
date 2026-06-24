const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Aisle = sequelize.define('Aisle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING }
});

// 👇 AGREGA ESTAS DOS LÍNEAS AL FINAL DEL ARCHIVO 👇
const Section = require('./Section');
Aisle.hasMany(Section, { foreignKey: 'aisleId' });

module.exports = Aisle;