// const { Pool } = require('pg');
// const fs = require('fs');
// const path = require('path');

// // Database migration script for LinkedIn Sales Automation Tool
// async function runMigration() {
//     const pool = new Pool({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT,
//         ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
//     });

//     try {
//         console.log('🔄 Starting database migration...');

//         // Try multiple possible paths for schema.sql
//         const possiblePaths = [
//             path.join(__dirname, '..', '..', 'database', 'schema.sql'),
//             path.join(__dirname, '..', 'database', 'schema.sql'),
//             path.join(__dirname, 'database', 'schema.sql'),
//             path.join(process.cwd(), 'database', 'schema.sql')
//         ];

//         let schemaPath = null;
//         let schemaSql = null;

//         for (const testPath of possiblePaths) {
//             if (fs.existsSync(testPath)) {
//                 schemaPath = testPath;
//                 console.log(`✅ Found schema file at: ${schemaPath}`);
//                 schemaSql = fs.readFileSync(schemaPath, 'utf8');
//                 break;
//             }
//         }

//         if (!schemaSql) {
//             throw new Error('Schema file not found in any expected location');
//         }
//         // Add this before executing the schema
// console.log('🗑️ Dropping existing tables...');
// await pool.query(`
//     DROP TABLE IF EXISTS analytics_events CASCADE;
//     DROP TABLE IF EXISTS user_activity_logs CASCADE;
//     DROP TABLE IF EXISTS ai_processing_logs CASCADE;
//     DROP TABLE IF EXISTS campaign_analytics CASCADE;
//     DROP TABLE IF EXISTS messages CASCADE;
//     DROP TABLE IF EXISTS message_templates CASCADE;
//     DROP TABLE IF EXISTS prospects CASCADE;
//     DROP TABLE IF EXISTS campaigns CASCADE;
//     DROP TABLE IF EXISTS users CASCADE;
//     DROP TABLE IF EXISTS ai_profile_analyses CASCADE;
// `);
// console.log('✅ Existing tables dropped');


//         // Execute the schema
//         await pool.query(schemaSql);

//         console.log('✅ Database schema created successfully!');

//         // Check if tables were created
//         const tablesResult = await pool.query(`
//             SELECT table_name 
//             FROM information_schema.tables 
//             WHERE table_schema = 'public'
//             ORDER BY table_name
//         `);

//         console.log('📋 Created tables:');
//         tablesResult.rows.forEach(row => {
//             console.log(`   - ${row.table_name}`);
//         });

//         console.log('🎉 Migration completed successfully!');

//     } catch (error) {
//         console.error('❌ Migration failed:', error.message);
//         process.exit(1);
//     } finally {
//         await pool.end();
//     }
// }

// // Run migration if called directly
// if (require.main === module) {
//     require('dotenv').config();
//     runMigration();
// }

// module.exports = runMigration;






// # !/usr/bin/env node

/**
 * Database Migration Script for LinkedIn Sales Automation Tool
 * This script creates the database and all required tables
 */

const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432
};

const dbName = process.env.DB_NAME || 'linkedin_sales_automation';

async function createDatabaseIfNotExists() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL server');
    
    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`🏗️ Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Please ensure PostgreSQL is running');
      console.log('   - Windows: Start PostgreSQL service');
      console.log('   - macOS: brew services start postgresql');
      console.log('   - Linux: sudo systemctl start postgresql');
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  const pool = new Pool({
    ...dbConfig,
    database: dbName
  });
  
  try {
    console.log(`🔗 Connecting to database: ${dbName}`);
    const client = await pool.connect();
    
    // Read and execute schema file
    // const schemaPath = path.join(__dirname, '../database/schema.sql');
    // const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');


    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    console.log('📝 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🏗️ Executing database migrations...');
    await client.query(schema);
    
    console.log('✅ Database schema created successfully');
    
    // Verify tables were created
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:');
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function seedDatabase() {
  const pool = new Pool({
    ...dbConfig,
    database: dbName
  });
  
  try {
    const client = await pool.connect();
    
    console.log('🌱 Seeding database with sample data...');
    
    // Check if demo user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@salesforge.ai']
    );
    
    if (existingUser.rows.length === 0) {
      // Create demo user with bcrypt hash for 'demo123'
      await client.query(`
        INSERT INTO users (name, email, password_hash, subscription_plan) 
        VALUES ($1, $2, $3, $4)
      `, [
        'Demo User',
        'demo@salesforge.ai',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/oWo2HDvBm', // bcrypt hash for 'demo123'
        'pro'
      ]);
      
      console.log('✅ Demo user created');
      console.log('   📧 Email: demo@salesforge.ai');
      console.log('   🔑 Password: demo123');
    } else {
      console.log('✅ Demo user already exists');
    }
    
    // Create sample message templates
    const templateCheck = await client.query('SELECT COUNT(*) FROM message_templates');
    if (parseInt(templateCheck.rows[0].count) === 0) {
      const userId = existingUser.rows.length > 0 ? existingUser.rows[0].id : 
        (await client.query('SELECT id FROM users WHERE email = $1', ['demo@salesforge.ai'])).rows[0].id;
      
      await client.query(`
        INSERT INTO message_templates (user_id, name, template_type, content, brand_voice) VALUES
        ($1, 'Professional Connection Request', 'connection', 'Hi {{name}}, I noticed your expertise in {{field}} and thought you might find our solution interesting. Would love to connect and share some insights that could be relevant for {{company}}.', 'professional'),
        ($2, 'Friendly Follow-up', 'follow_up', 'Hi {{name}}, hope you''re doing well! Following up on my previous message about how we help companies like {{company}} with {{pain_point}}. Worth a quick chat?', 'friendly'),
        ($3, 'Meeting Request', 'meeting_request', 'Hi {{name}}, would love to schedule a brief 15-minute call to discuss how we can help {{company}} achieve {{goal}}. Available this week?', 'consultative')
      `, [userId, userId, userId]);
      
      console.log('✅ Sample templates created');
    }
    
    client.release();
    console.log('🎉 Database seeding completed');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('🚀 Starting database migration...');
  
  try {
    await createDatabaseIfNotExists();
    await runMigrations();
    await seedDatabase();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('🔑 Demo credentials:');
    console.log('   📧 Email: demo@salesforge.ai');
    console.log('   🔑 Password: demo123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createDatabaseIfNotExists, runMigrations, seedDatabase };