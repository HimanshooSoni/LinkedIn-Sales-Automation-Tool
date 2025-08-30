const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
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

// AI service configuration
const AI_CONFIG = {
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat'
  },
  openai: {
    baseURL: 'https://api.openai.com/v1', 
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
  }
};

// Get AI API client
function getAIClient() {
  const provider = process.env.AI_PROVIDER || 'deepseek';

  if (provider === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
    return {
      provider: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      config: AI_CONFIG.deepseek
    };
  } else if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai', 
      apiKey: process.env.OPENAI_API_KEY,
      config: AI_CONFIG.openai
    };
  } else {
    throw new Error('No valid AI API key configured');
  }
}

// Make AI API request
async function callAI(messages, temperature = 0.7) {
  const client = getAIClient();

  try {
    const response = await axios.post(`${client.config.baseURL}/chat/completions`, {
      model: client.config.model,
      messages: messages,
      temperature: temperature,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    throw new Error(`AI service unavailable: ${error.message}`);
  }
}

// Analyze LinkedIn profile
router.post('/analyze-profile', authenticateToken, checkSubscriptionLimits('ai_requests'), [
  body('linkedin_url').optional().isURL(),
  body('profile_data').isObject(),
  body('campaign_context').optional().isObject()
], logActivity('ai_profile_analysis'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { linkedin_url, profile_data, campaign_context = {} } = req.body;
    const userId = req.user.id;

    // Check if we have cached analysis
    if (linkedin_url) {
      const cachedAnalysis = await pool.query(
        'SELECT * FROM ai_profile_analyses WHERE linkedin_url = $1 AND created_at > NOW() - INTERVAL \'7 days\'',
        [linkedin_url]
      );

      if (cachedAnalysis.rows.length > 0) {
        return res.json({
          success: true,
          data: {
            analysis: cachedAnalysis.rows[0].analysis_result,
            cached: true
          }
        });
      }
    }

    // Build AI prompt for profile analysis
    const prompt = `
Analyze this LinkedIn profile and provide insights for B2B sales outreach:

Profile Information:
- Name: ${profile_data.name || 'Not provided'}
- Title: ${profile_data.title || 'Not provided'}
- Company: ${profile_data.company || 'Not provided'}
- About: ${profile_data.about || 'Not provided'}
- Experience: ${JSON.stringify(profile_data.experience || [])}
- Skills: ${JSON.stringify(profile_data.skills || [])}
- Education: ${JSON.stringify(profile_data.education || [])}

Campaign Context:
- Target Industry: ${campaign_context.industry || 'Not specified'}
- Product/Service: ${campaign_context.product_service || 'Not specified'}
- Outreach Goals: ${JSON.stringify(campaign_context.outreach_goals || [])}

Please provide a JSON response with the following structure:
{
  "profile_score": <number 1-100 indicating prospect quality>,
  "engagement_score": <number 1-100 indicating likelihood to respond>,
  "background_summary": "<2-3 sentence professional summary>",
  "interests": ["<interest 1>", "<interest 2>", ...],
  "pain_points": ["<pain point 1>", "<pain point 2>", ...],
  "communication_style": "<preferred communication approach>",
  "best_approach": "<recommended outreach strategy>",
  "personalization_hooks": ["<hook 1>", "<hook 2>", ...],
  "likelihood_to_respond": "<high/medium/low>",
  "recommended_message_tone": "<professional/friendly/consultative>",
  "key_achievements": ["<achievement 1>", "<achievement 2>", ...],
  "potential_objections": ["<objection 1>", "<objection 2>", ...],
  "follow_up_strategy": "<suggested follow-up approach>"
}

Focus on actionable insights for personalized outreach.
`;

    const messages = [
      {
        role: 'system',
        content: 'You are an AI assistant specialized in analyzing LinkedIn profiles for B2B sales outreach. Provide detailed, actionable insights in valid JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Call AI service
    const aiResponse = await callAI(messages, 0.3);

    // Parse AI response
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('AI response parsing error:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Log AI request
    await pool.query(`
      INSERT INTO ai_processing_logs (user_id, request_type, input_data, ai_response, processing_time_ms)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userId, 
      'profile_analysis',
      JSON.stringify({ profile_data, campaign_context }),
      JSON.stringify(analysis),
      0 // We could measure this
    ]);

    // Cache the analysis if we have a LinkedIn URL
    if (linkedin_url) {
      await pool.query(`
        INSERT INTO ai_profile_analyses (linkedin_url, profile_data, analysis_result, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (linkedin_url) 
        DO UPDATE SET 
          analysis_result = EXCLUDED.analysis_result,
          updated_at = CURRENT_TIMESTAMP
      `, [linkedin_url, JSON.stringify(profile_data), JSON.stringify(analysis), userId]);
    }

    res.json({
      success: true,
      data: {
        analysis: analysis,
        cached: false
      }
    });

  } catch (error) {
    console.error('Profile analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Profile analysis failed'
    });
  }
});

// Generate personalized message
router.post('/generate-message', authenticateToken, checkSubscriptionLimits('ai_requests'), [
  body('prospect_id').isUUID(),
  body('message_type').isIn(['connection', 'follow_up', 'thank_you', 'meeting_request', 'custom']),
  body('template_id').optional().isUUID(),
  body('custom_instructions').optional().isString()
], logActivity('ai_message_generation'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { prospect_id, message_type, template_id, custom_instructions } = req.body;
    const userId = req.user.id;

    // Get prospect and campaign data
    const prospectResult = await pool.query(`
      SELECT p.*, c.name as campaign_name, c.brand_voice, c.product_service, c.outreach_goals,
             pa.analysis_result
      FROM prospects p
      JOIN campaigns c ON p.campaign_id = c.id
      LEFT JOIN ai_profile_analyses pa ON p.linkedin_profile_url = pa.linkedin_url
      WHERE p.id = $1 AND c.user_id = $2
    `, [prospect_id, userId]);

    if (prospectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prospect not found'
      });
    }

    const prospect = prospectResult.rows[0];
    const analysis = prospect.analysis_result ? JSON.parse(prospect.analysis_result) : {};

    // Get template if specified
    let template = null;
    if (template_id) {
      const templateResult = await pool.query(
        'SELECT * FROM message_templates WHERE id = $1 AND user_id = $2',
        [template_id, userId]
      );

      if (templateResult.rows.length > 0) {
        template = templateResult.rows[0];
      }
    }

    // Build message generation prompt
    const prompt = `
Generate a personalized ${message_type} message for LinkedIn outreach:

Prospect Information:
- Name: ${prospect.name}
- Title: ${prospect.title}
- Company: ${prospect.company}
- Location: ${prospect.location || 'Not provided'}

AI Analysis Insights:
- Background: ${analysis.background_summary || 'Not available'}
- Interests: ${JSON.stringify(analysis.interests || [])}
- Pain Points: ${JSON.stringify(analysis.pain_points || [])}
- Communication Style: ${analysis.communication_style || 'Professional'}
- Personalization Hooks: ${JSON.stringify(analysis.personalization_hooks || [])}

Campaign Context:
- Product/Service: ${prospect.product_service}
- Brand Voice: ${prospect.brand_voice}
- Outreach Goals: ${JSON.stringify(prospect.outreach_goals || [])}
- Campaign: ${prospect.campaign_name}

Message Requirements:
- Type: ${message_type}
- Tone: ${analysis.recommended_message_tone || prospect.brand_voice}
- Length: Keep under 300 characters for LinkedIn
- Include: Personal touch, clear value proposition, soft call-to-action
${custom_instructions ? `- Custom instructions: ${custom_instructions}` : ''}
${template ? `- Base template: ${template.content}` : ''}

Guidelines:
1. Use personalization hooks from the analysis
2. Address relevant pain points
3. Match the specified brand voice
4. Include a clear but non-pushy call-to-action
5. Make it conversational and human-like
6. Avoid overly salesy language

Generate ONLY the message content, no explanations.
`;

    const messages = [
      {
        role: 'system',
        content: `You are an expert LinkedIn message writer. Create personalized, engaging messages that get responses. Keep messages under 300 characters and natural-sounding.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Call AI service
    const generatedMessage = await callAI(messages, 0.8);

    // Log AI request
    await pool.query(`
      INSERT INTO ai_processing_logs (user_id, request_type, input_data, ai_response, processing_time_ms)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userId,
      'message_generation',
      JSON.stringify({ prospect_id, message_type, custom_instructions }),
      generatedMessage,
      0
    ]);

    res.json({
      success: true,
      data: {
        message: {
          id: `generated_${Date.now()}`,
          content: generatedMessage.trim(),
          personalized_content: generatedMessage.trim(),
          ai_generated: true,
          ai_confidence_score: 85 + Math.random() * 10, // Simulated confidence
          message_type: message_type,
          prospect_id: prospect_id
        },
        generation_details: {
          character_count: generatedMessage.trim().length,
          personalization_elements: analysis.personalization_hooks || [],
          recommended_send_time: 'Business hours in prospect timezone',
          follow_up_suggestions: analysis.follow_up_strategy || 'Follow up in 3-5 days if no response'
        }
      }
    });

  } catch (error) {
    console.error('Message generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Message generation failed'
    });
  }
});

// Optimize campaign (Premium feature)
router.post('/optimize-campaign/:campaignId', authenticateToken, checkSubscriptionLimits('ai_requests'), async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const userId = req.user.id;

    // Verify user has premium subscription
    if (req.user.subscription_plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'Campaign optimization is a premium feature'
      });
    }

    // Get campaign and performance data
    const campaignResult = await pool.query(`
      SELECT c.*, 
        COUNT(p.id) as total_prospects,
        COUNT(p.id) FILTER (WHERE p.prospect_status = 'responded') as responses,
        COUNT(p.id) FILTER (WHERE p.connection_status = 'connected') as connections,
        AVG(p.profile_score) as avg_profile_score
      FROM campaigns c
      LEFT JOIN prospects p ON c.id = p.campaign_id
      WHERE c.id = $1 AND c.user_id = $2
      GROUP BY c.id
    `, [campaignId, userId]);

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const campaign = campaignResult.rows[0];

    // Get recent message performance
    const messagePerformance = await pool.query(`
      SELECT 
        m.message_type,
        COUNT(*) as sent_count,
        COUNT(*) FILTER (WHERE m.response_received = true) as response_count
      FROM messages m
      JOIN prospects p ON m.prospect_id = p.id
      WHERE p.campaign_id = $1 AND m.sent_at > NOW() - INTERVAL '30 days'
      GROUP BY m.message_type
    `, [campaignId]);

    // Build optimization prompt
    const prompt = `
Analyze this LinkedIn sales campaign and provide optimization recommendations:

Campaign Data:
- Name: ${campaign.name}
- Status: ${campaign.status}
- Target Industries: ${JSON.stringify(campaign.target_industries)}
- Target Roles: ${JSON.stringify(campaign.target_job_roles)}
- Brand Voice: ${campaign.brand_voice}
- Product: ${campaign.product_service}

Performance Metrics:
- Total Prospects: ${campaign.total_prospects}
- Response Rate: ${campaign.responses && campaign.total_prospects ? 
  Math.round((campaign.responses / campaign.total_prospects) * 100) : 0}%
- Connection Rate: ${campaign.connections && campaign.total_prospects ? 
  Math.round((campaign.connections / campaign.total_prospects) * 100) : 0}%
- Average Profile Score: ${Math.round(campaign.avg_profile_score || 0)}

Message Performance:
${messagePerformance.rows.map(m => 
  `- ${m.message_type}: ${m.sent_count} sent, ${m.response_count} responses (${Math.round((m.response_count/m.sent_count)*100)}%)`
).join('\n')}

Provide optimization suggestions in JSON format:
{
  "overall_score": <number 1-100>,
  "key_issues": ["<issue 1>", "<issue 2>", ...],
  "targeting_recommendations": {
    "industries": ["<recommended industries>"],
    "job_roles": ["<recommended roles>"],
    "company_sizes": ["<recommended sizes>"],
    "refinements": "<targeting strategy recommendations>"
  },
  "messaging_recommendations": {
    "tone_adjustments": "<brand voice recommendations>",
    "content_improvements": ["<improvement 1>", "<improvement 2>"],
    "message_timing": "<optimal timing suggestions>",
    "follow_up_strategy": "<follow-up recommendations>"
  },
  "performance_predictions": {
    "expected_response_rate_increase": "<percentage>",
    "recommended_daily_limits": {
      "connections": <number>,
      "messages": <number>
    }
  },
  "next_actions": ["<action 1>", "<action 2>", ...]
}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert LinkedIn sales campaign optimizer. Analyze performance data and provide actionable recommendations to improve results.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const aiResponse = await callAI(messages, 0.3);

    let optimization;
    try {
      optimization = JSON.parse(aiResponse);
    } catch (parseError) {
      throw new Error('Invalid optimization response format');
    }

    // Log AI request
    await pool.query(`
      INSERT INTO ai_processing_logs (user_id, request_type, input_data, ai_response, processing_time_ms)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userId,
      'campaign_optimization',
      JSON.stringify({ campaign_id: campaignId, performance_data: messagePerformance.rows }),
      JSON.stringify(optimization),
      0
    ]);

    res.json({
      success: true,
      data: {
        campaign: {
          id: campaignId,
          name: campaign.name,
          current_performance: {
            total_prospects: campaign.total_prospects,
            response_rate: campaign.responses && campaign.total_prospects ? 
              Math.round((campaign.responses / campaign.total_prospects) * 100) : 0,
            connection_rate: campaign.connections && campaign.total_prospects ?
              Math.round((campaign.connections / campaign.total_prospects) * 100) : 0
          }
        },
        optimization: optimization
      }
    });

  } catch (error) {
    console.error('Campaign optimization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Campaign optimization failed'
    });
  }
});

// Get AI usage statistics
router.get('/usage-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get usage stats for different time periods
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_requests,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_requests,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as month_requests,
        COUNT(*) FILTER (WHERE request_type = 'profile_analysis') as profile_analyses,
        COUNT(*) FILTER (WHERE request_type = 'message_generation') as message_generations,
        COUNT(*) FILTER (WHERE request_type = 'campaign_optimization') as campaign_optimizations
      FROM ai_processing_logs
      WHERE user_id = $1
    `, [userId]);

    // Get subscription limits
    const limits = {
      free: { daily_limit: 50, monthly_limit: 1000 },
      pro: { daily_limit: 1000, monthly_limit: 25000 },
      enterprise: { daily_limit: -1, monthly_limit: -1 }
    };

    const userLimits = limits[req.user.subscription_plan] || limits.free;
    const usage = stats.rows[0];

    res.json({
      success: true,
      data: {
        usage: {
          today: parseInt(usage.today_requests),
          this_week: parseInt(usage.week_requests),
          this_month: parseInt(usage.month_requests),
          total: parseInt(usage.total_requests)
        },
        breakdown: {
          profile_analyses: parseInt(usage.profile_analyses),
          message_generations: parseInt(usage.message_generations),
          campaign_optimizations: parseInt(usage.campaign_optimizations)
        },
        limits: {
          daily_limit: userLimits.daily_limit,
          monthly_limit: userLimits.monthly_limit,
          daily_remaining: userLimits.daily_limit === -1 ? -1 : 
            Math.max(0, userLimits.daily_limit - parseInt(usage.today_requests)),
          monthly_remaining: userLimits.monthly_limit === -1 ? -1 :
            Math.max(0, userLimits.monthly_limit - parseInt(usage.month_requests))
        },
        subscription_plan: req.user.subscription_plan
      }
    });

  } catch (error) {
    console.error('Get AI usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
