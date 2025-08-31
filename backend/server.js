// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const {
//   authenticateToken,
//   requirePremium,
//   checkSubscriptionLimits,
//   logActivity
// } = require('./middleware/auth');


// // Import routes
// const authRoutes = require('./routes/auth');
// const campaignRoutes = require('./routes/campaigns');
// const prospectRoutes = require('./routes/prospects');
// const messageRoutes = require('./routes/messages');
// const analyticsRoutes = require('./routes/analytics');
// const aiRoutes = require('./routes/ai');

// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       imgSrc: ["'self'", "data:", "https:"],
//       scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
//       connectSrc: ["'self'", "https://api.openai.com", "https://api.deepseek.com"]
//     }
//   }
// }));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };
// app.use(cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
//   max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests from this IP, please try again later.',
//     retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000) / 1000)
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Compression middleware
// app.use(compression());

// // Logging middleware
// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan('combined'));
// }

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/campaigns', campaignRoutes);
// app.use('/api/prospects', prospectRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/ai', aiRoutes);

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
//   });
// }

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);

//   // Don't expose sensitive error details in production
//   if (process.env.NODE_ENV === 'production') {
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   } else {
//     res.status(err.status || 500).json({
//       success: false,
//       message: err.message,
//       stack: err.stack
//     });
//   }
// });

// // Handle 404 for API routes
// app.use('/api/*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found'
//   });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/health`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });

// module.exports = app;


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const express = require('express');
const path = require('path');

// YEH LINES ADD KARO:
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Test database connection first
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'linkedin_sales_automation',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test if users table exists
    const result = await client.query("SELECT to_regclass('public.users') as table_exists;");
    if (result.rows[0].table_exists) {
      console.log('✅ Database schema verified');
    } else {
      console.log('⚠️ Database schema not found. Please run migration.');
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('🔧 Please ensure PostgreSQL is running and database exists');
    
    // Don't exit, allow server to start for debugging
    // process.exit(1);
  }
}

// Initialize database connection test
testDatabaseConnection();

// Import routes
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const prospectRoutes = require('./routes/prospects');
const messageRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.deepseek.com"]
    }
  }
}));

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://localhost:3001',
      'file://' // Allow file:// for local HTML files
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      database_time: result.rows[0].now
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Test endpoint for frontend
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/prospects', prospectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } else {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/`);
  
  // Test database connection after server starts
  setTimeout(testDatabaseConnection, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    pool.end(() => {
      console.log('Database connections closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    pool.end(() => {
      console.log('Database connections closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
});

module.exports = app;