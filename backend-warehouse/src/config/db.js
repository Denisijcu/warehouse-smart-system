const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar la URL completa de Railway (copiada de tus variables)
const sequelize = new Sequelize(
  'postgresql://postgres:RpnFlMCwxqQsHAjPmLmNYsWFyeraEMlj@reseau.proxy.rlwy.net:24125/railway',
  {
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
);

module.exports = sequelize;