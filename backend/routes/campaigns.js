const express = require('express');
const { Pool } = require('pg');
const { body, query, validationResult } = require('express-validator');
const { authenticateToken, checkSubscriptionLimits, logActivity } = require('../middleware/auth');

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get user campaigns
router.get('/', authenticateToken, [
  query('status').optional().isIn(['draft', 'active', 'paused', 'completed', 'archived']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
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

    const { status, limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT c.*, 
        COUNT(p.id) as total_prospects,
        COUNT(p.id) FILTER (WHERE p.prospect_status = 'contacted') as contacted_prospects,
        COUNT(p.id) FILTER (WHERE p.prospect_status = 'responded') as responded_prospects,
        CASE 
          WHEN COUNT(p.id) > 0 THEN 
            ROUND((COUNT(p.id) FILTER (WHERE p.prospect_status = 'responded')::DECIMAL / COUNT(p.id) * 100), 2)
          ELSE 0 
        END as response_rate
      FROM campaigns c
      LEFT JOIN prospects p ON c.id = p.campaign_id
      WHERE c.user_id = $1
    `;

    const queryParams = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    query += `
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM campaigns WHERE user_id = $1';
    const countParams = [userId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        campaigns: result.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      }
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new campaign
router.post('/', authenticateToken, checkSubscriptionLimits('campaigns'), [
  body('name').trim().isLength({ min: 2, max: 255 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('target_industries').isArray({ min: 1 }),
  body('target_job_roles').isArray({ min: 1 }),
  body('target_company_sizes').isArray({ min: 1 }),
  body('target_locations').isArray({ min: 1 }),
  body('product_service').trim().isLength({ min: 10, max: 1000 }),
  body('outreach_goals').isArray({ min: 1 }),
  body('brand_voice').isIn(['professional', 'friendly', 'consultative', 'enthusiastic'])
], logActivity('campaign_created'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      name, description, target_industries, target_job_roles,
      target_company_sizes, target_locations, product_service,
      outreach_goals, brand_voice, optional_triggers = [],
      daily_connection_limit = 20, weekly_message_limit = 100
    } = req.body;

    const result = await pool.query(`
      INSERT INTO campaigns (
        user_id, name, description, target_industries, target_job_roles,
        target_company_sizes, target_locations, product_service,
        outreach_goals, brand_voice, optional_triggers,
        daily_connection_limit, weekly_message_limit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      userId, name, description, target_industries, target_job_roles,
      target_company_sizes, target_locations, product_service,
      outreach_goals, brand_voice, optional_triggers,
      daily_connection_limit, weekly_message_limit
    ]);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: { campaign: result.rows[0] }
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single campaign
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT c.*, 
        COUNT(p.id) as total_prospects,
        COUNT(p.id) FILTER (WHERE p.prospect_status = 'contacted') as contacted_prospects,
        COUNT(p.id) FILTER (WHERE p.prospect_status = 'responded') as responded_prospects,
        COUNT(p.id) FILTER (WHERE p.connection_status = 'connected') as connected_prospects,
        CASE 
          WHEN COUNT(p.id) > 0 THEN 
            ROUND((COUNT(p.id) FILTER (WHERE p.prospect_status = 'responded')::DECIMAL / COUNT(p.id) * 100), 2)
          ELSE 0 
        END as response_rate,
        CASE 
          WHEN COUNT(p.id) > 0 THEN 
            ROUND((COUNT(p.id) FILTER (WHERE p.connection_status = 'connected')::DECIMAL / COUNT(p.id) * 100), 2)
          ELSE 0 
        END as connection_rate
      FROM campaigns c
      LEFT JOIN prospects p ON c.id = p.campaign_id
      WHERE c.id = $1 AND c.user_id = $2
      GROUP BY c.id
    `, [campaignId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: { campaign: result.rows[0] }
    });

  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update campaign
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 255 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('target_industries').optional().isArray({ min: 1 }),
  body('target_job_roles').optional().isArray({ min: 1 }),
  body('brand_voice').optional().isIn(['professional', 'friendly', 'consultative', 'enthusiastic'])
], logActivity('campaign_updated'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const campaignId = req.params.id;
    const userId = req.user.id;

    // Check if campaign exists and belongs to user
    const existingCampaign = await pool.query(
      'SELECT id, status FROM campaigns WHERE id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (existingCampaign.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const updates = {};
    const queryParts = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'name', 'description', 'target_industries', 'target_job_roles',
      'target_company_sizes', 'target_locations', 'product_service',
      'outreach_goals', 'brand_voice', 'optional_triggers',
      'daily_connection_limit', 'weekly_message_limit'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
        queryParts.push(`${field} = $${paramIndex}`);
        values.push(req.body[field]);
        paramIndex++;
      }
    }

    if (queryParts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(campaignId, userId);
    const query = `
      UPDATE campaigns 
      SET ${queryParts.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: { campaign: result.rows[0] }
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start campaign
router.post('/:id/start', authenticateToken, logActivity('campaign_started'), async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE campaigns 
      SET status = 'active', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND status = 'draft'
      RETURNING *
    `, [campaignId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or already started'
      });
    }

    res.json({
      success: true,
      message: 'Campaign started successfully',
      data: { campaign: result.rows[0] }
    });

  } catch (error) {
    console.error('Start campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Pause campaign
router.post('/:id/pause', authenticateToken, logActivity('campaign_paused'), async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE campaigns 
      SET status = 'paused', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND status = 'active'
      RETURNING *
    `, [campaignId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or not active'
      });
    }

    res.json({
      success: true,
      message: 'Campaign paused successfully',
      data: { campaign: result.rows[0] }
    });

  } catch (error) {
    console.error('Pause campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
