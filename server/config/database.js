const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let sslConfig = false;
const certPath = path.join(__dirname, '..', '..', 'ca.pem');

if (fs.existsSync(certPath)) {
  sslConfig = {
    ca: fs.readFileSync(certPath),
    rejectUnauthorized: true
  };
  console.log('📋 Using SSL certificate for Aiven connection');
} else {
  console.log('⚠️ SSL certificate not found, using non-SSL connection');
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
  connectTimeout: 60000,
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Aiven MySQL Database connected successfully');
    console.log(`📍 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`🗃️ Database: ${process.env.DB_NAME}`);
    
    const [result] = await connection.execute('SELECT VERSION() as version');
    console.log(`🔢 MySQL Version: ${result[0].version}`);
    
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Check your Aiven database credentials and SSL certificate');
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
