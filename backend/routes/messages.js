const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkSubscriptionLimits } = require('../middleware/auth');

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get message templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM message_templates WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: { templates: result.rows }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send message
router.post('/send', authenticateToken, checkSubscriptionLimits('messages'), [
  body('prospect_id').isUUID(),
  body('message_type').isIn(['connection', 'follow_up', 'thank_you', 'meeting_request']),
  body('content').trim().isLength({ min: 10, max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { prospect_id, message_type, content, subject_line } = req.body;
    const userId = req.user.id;

    // Verify prospect belongs to user
    const prospectResult = await pool.query(`
      SELECT p.id FROM prospects p 
      JOIN campaigns c ON p.campaign_id = c.id 
      WHERE p.id = $1 AND c.user_id = $2
    `, [prospect_id, userId]);

    if (prospectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prospect not found'
      });
    }

    const result = await pool.query(`
      INSERT INTO messages (prospect_id, message_type, content, subject_line, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [prospect_id, message_type, content, subject_line, 'sent']);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: result.rows[0] }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
