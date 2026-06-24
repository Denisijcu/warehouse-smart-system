
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Section = sequelize.define('Section', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  aisleId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Section;