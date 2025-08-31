require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ SUCCESS! Database connected with .env credentials');
    console.log('Credentials used:');
    console.log(`  User: ${process.env.DB_USER}`);
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Port: ${process.env.DB_PORT}`);
    console.log(`  Password: "${process.env.DB_PASSWORD}"`);
    client.release();
    await pool.end();
  } catch (error) {
    console.log('❌ FAILED! Database connection error:');
    console.log(`  ${error.message}`);
    console.log('\nCredentials being used:');
    console.log(`  User: ${process.env.DB_USER}`);
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Port: ${process.env.DB_PORT}`);  
    console.log(`  Password: "${process.env.DB_PASSWORD}"`);
  }
}

testConnection();
