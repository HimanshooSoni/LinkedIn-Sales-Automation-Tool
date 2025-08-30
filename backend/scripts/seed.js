const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create sample user
    const hashedPassword = await bcrypt.hash('demo123456', 12);

    const userResult = await pool.query(`
      INSERT INTO users (name, email, password_hash, subscription_plan)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, ['Demo User', 'demo@salesforge.ai', hashedPassword, 'pro']);

    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;

      // Create sample campaign
      const campaignResult = await pool.query(`
        INSERT INTO campaigns (
          user_id, name, description,
          target_industries, target_job_roles, target_company_sizes, target_locations,
          product_service, outreach_goals, brand_voice
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        userId,
        'Enterprise SaaS Demo Campaign',
        'Sample campaign for testing the platform',
        ['SaaS', 'Technology'],
        ['VP Engineering', 'CTO', 'Head of Product'],
        ['200-1000', '1000+'],
        ['North America', 'Europe'],
        'AI-powered development platform for scaling engineering teams',
        ['demo', 'call'],
        'professional'
      ]);

      if (campaignResult.rows.length > 0) {
        const campaignId = campaignResult.rows[0].id;

        // Create sample prospect
        await pool.query(`
          INSERT INTO prospects (
            campaign_id, name, title, company, linkedin_profile_url,
            prospect_status, priority_level, profile_score, engagement_score
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          campaignId,
          'Alexandra Chen',
          'VP of Engineering',
          'TechFlow Systems',
          'https://linkedin.com/in/alexandrachen-demo',
          'pending',
          'high',
          85,
          78
        ]);

        // Create sample message template
        await pool.query(`
          INSERT INTO message_templates (
            user_id, name, template_type, content, brand_voice
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          userId,
          'Professional Introduction',
          'connection',
          'Hi {{name}}, I noticed your work in {{industry}} and thought you might be interested in how we help companies improve {{pain_point}}. Would love to connect and share some insights.',
          'professional'
        ]);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Demo user: demo@salesforge.ai');
    console.log('🔑 Password: demo123456');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
