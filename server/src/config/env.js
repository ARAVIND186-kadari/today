const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agentflow_ai',
  jwtSecret: process.env.JWT_SECRET || 'agentflow_super_secret_jwt_key_2026_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // 32 bytes hex
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  oauth: {
    gmail: {
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
      redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/api/integrations/oauth/gmail/callback',
    },
    slack: {
      clientId: process.env.SLACK_CLIENT_ID || '',
      clientSecret: process.env.SLACK_CLIENT_SECRET || '',
      redirectUri: process.env.SLACK_REDIRECT_URI || 'http://localhost:5000/api/integrations/oauth/slack/callback',
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/api/integrations/oauth/discord/callback',
      botToken: process.env.DISCORD_BOT_TOKEN || '',
    },
    googleSheets: {
      clientId: process.env.GOOGLE_SHEETS_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_SHEETS_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_SHEETS_REDIRECT_URI || 'http://localhost:5000/api/integrations/oauth/google-sheets/callback',
    },
  },
};

module.exports = config;
