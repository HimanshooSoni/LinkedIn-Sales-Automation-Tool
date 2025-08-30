const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Middleware to check if user has premium subscription
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (req.user.subscription_plan === 'free') {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required for this feature'
    });
  }
  next();
};

// Middleware to check subscription limits
const checkSubscriptionLimits = (featureType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const limits = {
      free: {
        campaigns: 3,
        prospects: 500,
        messages_per_day: 20,
        ai_requests_per_day: 50
      },
      pro: {
        campaigns: 20,
        prospects: 10000,
        messages_per_day: 200,
        ai_requests_per_day: 1000
      },
      enterprise: {
        campaigns: -1, // unlimited
        prospects: -1,
        messages_per_day: -1,
        ai_requests_per_day: -1
      }
    };
    const userLimits = limits[req.user.subscription_plan] || limits.free;
    try {
      switch (featureType) {
        case 'campaigns':
          if (userLimits.campaigns !== -1) {
            const campaignCount = await pool.query(
              'SELECT COUNT(*) FROM campaigns WHERE user_id = $1 AND status != $2',
              [req.user.userId, 'archived']
            );
            if (parseInt(campaignCount.rows[0].count) >= userLimits.campaigns) {
              return res.status(403).json({
                success: false,
                message: `Campaign limit reached. Upgrade to create more campaigns.`,
                limit: userLimits.campaigns
              });
            }
          }
          break;
        case 'prospects':
          if (userLimits.prospects !== -1) {
            const prospectCount = await pool.query(
              'SELECT COUNT(*) FROM prospects p JOIN campaigns c ON p.campaign_id = c.id WHERE c.user_id = $1',
              [req.user.userId]
            );
            if (parseInt(prospectCount.rows[0].count) >= userLimits.prospects) {
              return res.status(403).json({
                success: false,
                message: `Prospect limit reached. Upgrade to add more prospects.`,
                limit: userLimits.prospects
              });
            }
          }
          break;
        case 'messages':
          if (userLimits.messages_per_day !== -1) {
            const todayMessages = await pool.query(
              `SELECT COUNT(*) FROM messages m 
               JOIN prospects p ON m.prospect_id = p.id 
               JOIN campaigns c ON p.campaign_id = c.id 
               WHERE c.user_id = $1 AND m.sent_at::date = CURRENT_DATE`,
              [req.user.userId]
            );
            if (parseInt(todayMessages.rows[0].count) >= userLimits.messages_per_day) {
              return res.status(403).json({
                success: false,
                message: `Daily message limit reached. Upgrade to send more messages.`,
                limit: userLimits.messages_per_day
              });
            }
          }
          break;
        case 'ai_requests':
          if (userLimits.ai_requests_per_day !== -1) {
            const todayAIRequests = await pool.query(
              `SELECT COUNT(*) FROM ai_processing_logs 
               WHERE user_id = $1 AND created_at::date = CURRENT_DATE`,
              [req.user.userId]
            );
            if (parseInt(todayAIRequests.rows[0].count) >= userLimits.ai_requests_per_day) {
              return res.status(403).json({
                success: false,
                message: `Daily AI request limit reached. Upgrade to continue.`,
                limit: userLimits.ai_requests_per_day
              });
            }
          }
          break;
      }
      next();
    } catch (error) {
      console.error('Subscription limit check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking subscription limits'
      });
    }
  };
};

// Middleware to log user activity
const logActivity = (activityType) => {
  return async (req, res, next) => {
    if (req.user) {
      try {
        await pool.query(`
          INSERT INTO user_activity_logs (
            user_id, activity_type, description, ip_address, 
            user_agent, http_method, endpoint, request_data
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          req.user.userId,
          activityType,
          `${activityType} action performed`,
          req.ip,
          req.get('User-Agent'),
          req.method,
          req.originalUrl,
          JSON.stringify(req.body)
        ]);
      } catch (error) {
        console.error('Activity logging error:', error);
        // Don't fail the request if logging fails
      }
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePremium,
  checkSubscriptionLimits,
  logActivity
};
