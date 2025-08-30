const express = require('express');
const { Pool } = require('pg');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const overallStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_campaigns,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') as active_campaigns,
        COUNT(DISTINCT p.id) as total_prospects,
        COUNT(DISTINCT m.id) as total_messages_sent,
        COUNT(DISTINCT m.id) FILTER (WHERE m.response_received = true) as total_responses,
        CASE 
          WHEN COUNT(DISTINCT m.id) > 0 THEN 
            ROUND((COUNT(DISTINCT m.id) FILTER (WHERE m.response_received = true)::DECIMAL / COUNT(DISTINCT m.id) * 100), 2)
          ELSE 0 
        END as overall_response_rate
      FROM campaigns c
      LEFT JOIN prospects p ON c.id = p.campaign_id
      LEFT JOIN messages m ON p.id = m.prospect_id
      WHERE c.user_id = $1
    `, [userId]);

    const weeklyActivity = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id) FILTER (WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days') as prospects_added_this_week,
        COUNT(DISTINCT m.id) FILTER (WHERE m.sent_at >= CURRENT_DATE - INTERVAL '7 days') as messages_sent_this_week,
        COUNT(DISTINCT m.id) FILTER (WHERE m.response_date >= CURRENT_DATE - INTERVAL '7 days') as responses_this_week
      FROM campaigns c
      LEFT JOIN prospects p ON c.id = p.campaign_id
      LEFT JOIN messages m ON p.id = m.prospect_id
      WHERE c.user_id = $1
    `, [userId]);

    res.json({
      success: true,
      data: {
        overview: overallStats.rows[0],
        weekly_activity: weeklyActivity.rows[0]
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
