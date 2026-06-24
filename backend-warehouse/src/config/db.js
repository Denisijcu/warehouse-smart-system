const { Sequelize } = require('sequelize');
require('dotenv').config();

// Si existe DATABASE_URL (Railway), úsala. Si no, usa las variables individuales
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
});

module.exports = sequelize;