const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const { initSocket } = require('./src/config/socket');
const { initQueue } = require('./src/queues/executionQueue');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const workflowRoutes = require('./src/routes/workflowRoutes');
const executionRoutes = require('./src/routes/executionRoutes');
const integrationRoutes = require('./src/routes/integrationRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow other origins in production
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'Agentflow_AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    langGraph: 'available',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

// Initialize Socket.IO
initSocket(server);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await initQueue();

    server.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Agentflow_AI Server running on port ${config.port}`);
      console.log(`🌐 Client URL: ${config.clientUrl}`);
      console.log(`⚙️  Environment: ${config.nodeEnv}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
