const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database migration script for LinkedIn Sales Automation Tool
async function runMigration() {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        console.log('🔄 Starting database migration...');

        // Try multiple possible paths for schema.sql
        const possiblePaths = [
            path.join(__dirname, '..', '..', 'database', 'schema.sql'),
            path.join(__dirname, '..', 'database', 'schema.sql'),
            path.join(__dirname, 'database', 'schema.sql'),
            path.join(process.cwd(), 'database', 'schema.sql')
        ];

        let schemaPath = null;
        let schemaSql = null;

        for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
                schemaPath = testPath;
                console.log(`✅ Found schema file at: ${schemaPath}`);
                schemaSql = fs.readFileSync(schemaPath, 'utf8');
                break;
            }
        }

        if (!schemaSql) {
            throw new Error('Schema file not found in any expected location');
        }
        // Add this before executing the schema
console.log('🗑️ Dropping existing tables...');
await pool.query(`
    DROP TABLE IF EXISTS analytics_events CASCADE;
    DROP TABLE IF EXISTS user_activity_logs CASCADE;
    DROP TABLE IF EXISTS ai_processing_logs CASCADE;
    DROP TABLE IF EXISTS campaign_analytics CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS message_templates CASCADE;
    DROP TABLE IF EXISTS prospects CASCADE;
    DROP TABLE IF EXISTS campaigns CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS ai_profile_analyses CASCADE;
`);
console.log('✅ Existing tables dropped');


        // Execute the schema
        await pool.query(schemaSql);

        console.log('✅ Database schema created successfully!');

        // Check if tables were created
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Created tables:');
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run migration if called directly
if (require.main === module) {
    require('dotenv').config();
    runMigration();
}

module.exports = runMigration;
