const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Ultra-Simple Database seed script - Individual INSERT statements
async function runSeed() {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        console.log('🌱 Starting database seeding...');

        // Check if data already exists
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCount.rows[0].count) > 0) {
            console.log('📊 Database already has seed data. Skipping...');
            return;
        }

        // Create demo users - ONE BY ONE
        const hashedPassword = await bcrypt.hash('password123', 12);
        
        console.log('👤 Creating demo users...');
        
        // User 1
        const user1 = await pool.query(`
            INSERT INTO users (name, email, password_hash, subscription_plan, linkedin_profile_url, company_name, industry)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email
        `, ['Demo User', 'demo@salesforge.ai', hashedPassword, 'pro', 'https://linkedin.com/in/demouser', 'SalesForge AI', 'SaaS']);

        // User 2
        const user2 = await pool.query(`
            INSERT INTO users (name, email, password_hash, subscription_plan, linkedin_profile_url, company_name, industry)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email
        `, ['John Doe', 'john@example.com', hashedPassword, 'free', 'https://linkedin.com/in/johndoe', 'TechCorp', 'Technology']);

        // User 3
        const user3 = await pool.query(`
            INSERT INTO users (name, email, password_hash, subscription_plan, linkedin_profile_url, company_name, industry)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email
        `, ['Sarah Johnson', 'sarah@company.com', hashedPassword, 'enterprise', 'https://linkedin.com/in/sarahjohnson', 'Enterprise Inc', 'Consulting']);

        console.log('👥 Created demo users:');
        console.log(`   - ${user1.rows[0].name} (${user1.rows[0].email})`);
        console.log(`   - ${user2.rows[0].name} (${user2.rows[0].email})`);
        console.log(`   - ${user3.rows[0].name} (${user3.rows[0].email})`);

        const demoUserId = user1.rows[0].id;

        // Create sample campaigns - ONE BY ONE
        console.log('🎯 Creating sample campaigns...');
        
        // Campaign 1
        const campaign1 = await pool.query(`
            INSERT INTO campaigns (
                user_id, name, description, target_industries, target_job_roles,
                target_company_sizes, target_locations, product_service,
                outreach_goals, brand_voice, status, daily_connection_limit, weekly_message_limit
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, name
        `, [
            demoUserId, 'Enterprise SaaS Q4', 'Target enterprise SaaS companies for Q4 expansion', 
            ['SaaS', 'Technology'], ['CTO', 'VP Engineering', 'Head of Product'],
            ['200-1000', '1000+'], ['North America', 'Europe'],
            'Enterprise-grade AI development platform for scaling engineering teams',
            ['demo', 'call'], 'professional', 'active', 25, 150
        ]);

        // Campaign 2
        const campaign2 = await pool.query(`
            INSERT INTO campaigns (
                user_id, name, description, target_industries, target_job_roles,
                target_company_sizes, target_locations, product_service,
                outreach_goals, brand_voice, status, daily_connection_limit, weekly_message_limit
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, name
        `, [
            demoUserId, 'FinTech Expansion', 'Expand into European FinTech market',
            ['FinTech', 'Financial Services'], ['Chief Technology Officer', 'Head of Innovation'],
            ['500+'], ['Europe', 'United Kingdom'],
            'Compliance-first API platform for financial services',
            ['demo', 'partnership'], 'consultative', 'active', 20, 100
        ]);

        // Campaign 3
        const campaign3 = await pool.query(`
            INSERT INTO campaigns (
                user_id, name, description, target_industries, target_job_roles,
                target_company_sizes, target_locations, product_service,
                outreach_goals, brand_voice, status, daily_connection_limit, weekly_message_limit
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, name
        `, [
            demoUserId, 'Healthcare Innovation', 'Target healthcare technology leaders',
            ['Healthcare', 'MedTech'], ['CIO', 'Chief Medical Officer', 'VP Technology'],
            ['1000+'], ['Global'],
            'HIPAA-compliant patient data analytics platform',
            ['demo'], 'professional', 'paused', 15, 75
        ]);

        console.log('🎯 Created sample campaigns:');
        console.log(`   - ${campaign1.rows[0].name}`);
        console.log(`   - ${campaign2.rows[0].name}`);
        console.log(`   - ${campaign3.rows[0].name}`);

        // Create sample prospects - ONE BY ONE
        console.log('👤 Creating sample prospects...');

        // Prospect 1
        const prospect1 = await pool.query(`
            INSERT INTO prospects (
                campaign_id, name, email, linkedin_profile_url, title, company, location,
                prospect_status, connection_status, priority_level, profile_score,
                engagement_score, notes, tags
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id, name
        `, [
            campaign1.rows[0].id, 'Alexandra Chen', 'alex@techflow.com', 'https://linkedin.com/in/alexandrachen',
            'VP of Engineering', 'TechFlow Systems', 'San Francisco, CA',
            'responded', 'connected', 'high', 85, 92,
            'Showed strong interest in AI development tools. Follow up on ROI discussion.',
            ['decision-maker', 'ai-interested', 'scaling-team']
        ]);

        // Prospect 2
        const prospect2 = await pool.query(`
            INSERT INTO prospects (
                campaign_id, name, email, linkedin_profile_url, title, company, location,
                prospect_status, connection_status, priority_level, profile_score,
                engagement_score, notes, tags
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id, name
        `, [
            campaign1.rows[0].id, 'David Rodriguez', 'david@innovate.com', 'https://linkedin.com/in/davidrodriguez',
            'CTO', 'InnovateLabs', 'Austin, TX',
            'contacted', 'pending', 'medium', 78, 65,
            'Startup CTO, interested in rapid scaling solutions.',
            ['startup-cto', 'growth-focused']
        ]);

        // Prospect 3
        const prospect3 = await pool.query(`
            INSERT INTO prospects (
                campaign_id, name, email, linkedin_profile_url, title, company, location,
                prospect_status, connection_status, priority_level, profile_score,
                engagement_score, notes, tags
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id, name
        `, [
            campaign2.rows[0].id, 'Sophie Mueller', 'sophie@eurobank.com', 'https://linkedin.com/in/sophiemueller',
            'Head of Innovation', 'European FinBank', 'London, UK',
            'pending', 'not_connected', 'high', 88, 40,
            'Innovation leader at major European bank. Focus on compliance benefits.',
            ['innovation-leader', 'fintech-expert', 'compliance-focused']
        ]);

        console.log('👤 Created sample prospects:');
        console.log(`   - ${prospect1.rows[0].name}`);
        console.log(`   - ${prospect2.rows[0].name}`);
        console.log(`   - ${prospect3.rows[0].name}`);

        // Create sample message templates - ONE BY ONE
        console.log('💬 Creating message templates...');

        await pool.query(`
            INSERT INTO message_templates (
                user_id, name, template_type, content, brand_voice, 
                personalization_fields, usage_count
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            demoUserId, 'Enterprise Introduction', 'connection',
            'Hi {{name}}, I noticed your work in {{industry}} and thought you might be interested in how {{company}} achieved {{metric}}% improvement in {{painPoint}}. Would love to share some insights that could be relevant for {{prospect_company}}. Open to a brief conversation?',
            'professional', ['name', 'industry', 'company', 'metric', 'painPoint', 'prospect_company'], 15
        ]);

        await pool.query(`
            INSERT INTO message_templates (
                user_id, name, template_type, content, brand_voice, 
                personalization_fields, usage_count
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            demoUserId, 'Follow-up Template', 'follow_up',
            'Hi {{name}}, following up on my previous message about {{topic}}. I came across {{relevant_news}} about {{prospect_company}} and thought this might be an interesting time to explore {{solution_benefit}}. Worth a 15-minute conversation?',
            'consultative', ['name', 'topic', 'relevant_news', 'prospect_company', 'solution_benefit'], 8
        ]);

        // Create sample messages - ONE BY ONE
        console.log('📨 Creating sample messages...');

        await pool.query(`
            INSERT INTO messages (
                prospect_id, message_type, content, status, sent_at, response_received, response_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            prospect1.rows[0].id, 'connection', 
            'Hi Alexandra, I noticed your work in AI/ML at TechFlow Systems and thought you might be interested in how similar companies have achieved 40% improvement in development velocity. Would love to share some insights that could be relevant for TechFlow. Open to a brief conversation?',
            'delivered', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), true, new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        ]);

        await pool.query(`
            INSERT INTO messages (
                prospect_id, message_type, content, status, sent_at, response_received, response_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            prospect2.rows[0].id, 'connection',
            'Hi David, I came across InnovateLabs and was impressed by your rapid growth trajectory. As a fellow CTO, I thought you might find our AI development platform interesting - we help startups scale their engineering teams efficiently.',
            'sent', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), false, null
        ]);

        // Create some basic analytics events
        console.log('📊 Creating analytics data...');

        await pool.query(`
            INSERT INTO analytics_events (user_id, campaign_id, prospect_id, event_type, event_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            demoUserId, campaign1.rows[0].id, prospect1.rows[0].id, 'prospect_added', '{"source": "manual", "quality_score": 85}'
        ]);

        await pool.query(`
            INSERT INTO analytics_events (user_id, campaign_id, prospect_id, event_type, event_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            demoUserId, campaign1.rows[0].id, prospect1.rows[0].id, 'message_sent', '{"type": "connection", "length": 245}'
        ]);

        // Create campaign analytics
        await pool.query(`
            INSERT INTO campaign_analytics (campaign_id, date, prospects_added, messages_sent, connections_made, responses_received)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            campaign1.rows[0].id, new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 5, 5, 3, 1
        ]);

        await pool.query(`
            INSERT INTO campaign_analytics (campaign_id, date, prospects_added, messages_sent, connections_made, responses_received)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            campaign1.rows[0].id, new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 3, 8, 2, 2
        ]);

        console.log('💬 Created sample messages and analytics data');

        console.log('🎉 Database seeding completed successfully!');
        console.log('');
        console.log('📋 Summary:');
        console.log('   - Users: 3');
        console.log('   - Campaigns: 3');
        console.log('   - Prospects: 3');
        console.log('   - Message templates: 2');
        console.log('   - Sample messages: 2');
        console.log('   - Analytics events created');
        console.log('');
        console.log('🔑 Demo Login Credentials:');
        console.log('   Email: demo@salesforge.ai');
        console.log('   Password: password123');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        if (error.position) {
            console.error('Error position:', error.position);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run seed if called directly
if (require.main === module) {
    require('dotenv').config();
    runSeed();
}

module.exports = runSeed;