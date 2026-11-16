const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sslConfig = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: false }
  : undefined;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
};

const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: Number(process.env.DB_POOL_LIMIT) || 10,
  waitForConnections: true,
});

async function inicializarBaseDeDatos() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado');

    // Verificar en singular ('usuario') según este nuevo esquema
    const [tables] = await conn.query("SHOW TABLES LIKE 'usuario'");
    conn.release();

    if (tables.length === 0) {
      console.log('⏳ Creando tablas de MicrocreditosBX desde database.sql...');
      const sqlPath = path.join(__dirname, '../../database.sql');
      const sqlScript = fs.readFileSync(sqlPath, 'utf8');

      const initConn = await mysql.createConnection({
        ...dbConfig,
        multipleStatements: true,
      });
      await initConn.query(sqlScript);
      await initConn.end();
      console.log('✅ Tablas y datos iniciales cargados en Aiven');
    }
  } catch (err) {
    console.error('❌ Error MySQL:', err);
    process.exit(1);
  }
}

inicializarBaseDeDatos();

module.exports = pool;