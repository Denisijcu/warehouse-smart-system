const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar variables individuales que Railway inyecta automáticamente
const sequelize = new Sequelize(
  process.env.PGDATABASE || process.env.DB_NAME || 'warehouse_db',
  process.env.PGUSER || process.env.DB_USER || 'postgres',
  process.env.PGPASSWORD || process.env.DB_PASSWORD || 'admin123',
  {
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    port: process.env.PGPORT || process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
);

module.exports = sequelize;