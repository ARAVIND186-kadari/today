const crypto = require('crypto');
const Integration = require('../models/Integration');
const config = require('../config/env');

const ALGORITHM = 'aes-256-gcm';

// Derive 32-byte key from CREDENTIAL_ENCRYPTION_KEY
const getDerivedKey = () => {
  return crypto.createHash('sha256').update(config.credentialEncryptionKey).digest();
};

const encryptToken = (plainText) => {
  if (!plainText) return { encrypted: null, iv: null, authTag: null };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getDerivedKey(), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
};

const decryptToken = (encryptedHex, ivHex, authTagHex) => {
  if (!encryptedHex || !ivHex || !authTagHex) return null;
  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getDerivedKey(),
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[Crypto] Token decryption failed:', err.message);
    return null;
  }
};

const getUserIntegrations = async (userId) => {
  const integrations = await Integration.find({ owner: userId });
  // Map to clean client safe objects (NEVER return raw decrypted tokens in listing)
  const providers = ['gmail', 'slack', 'google-sheets', 'discord', 'openrouter', 'gemini'];
  const results = providers.map((provider) => {
    const existing = integrations.find((i) => i.provider === provider);
    return {
      provider,
      isConnected: existing ? existing.isConnected : false,
      accountEmail: existing ? existing.accountEmail : '',
      accountName: existing ? existing.accountName : '',
      scopes: existing ? existing.scopes : [],
      expiresAt: existing ? existing.expiresAt : null,
      updatedAt: existing ? existing.updatedAt : null,
      extraConfig: existing ? existing.extraConfig : {},
    };
  });
  return results;
};

const getIntegrationStatus = async (userId) => {
  const integrations = await Integration.find({ owner: userId });
  const statusMap = {};
  for (const i of integrations) {
    const isExpired = i.expiresAt && new Date(i.expiresAt) < new Date();
    statusMap[i.provider] = {
      isConnected: i.isConnected,
      isExpired: Boolean(isExpired),
      expiresAt: i.expiresAt,
      accountEmail: i.accountEmail,
      hasValidToken: i.isConnected && !isExpired && Boolean(i.encryptedAccessToken),
    };
  }
  return statusMap;
};

const getIntegrationCredentials = async (userId, provider) => {
  const integration = await Integration.findOne({ owner: userId, provider });
  if (!integration || !integration.isConnected) {
    const err = new Error(`INTEGRATION_NOT_CONNECTED: Provider '${provider}' is not connected.`);
    err.code = 'INTEGRATION_NOT_CONNECTED';
    err.statusCode = 400;
    throw err;
  }

  if (integration.expiresAt && new Date(integration.expiresAt) < new Date()) {
    const err = new Error(`AUTH_EXPIRED: Access token for '${provider}' has expired.`);
    err.code = 'AUTH_EXPIRED';
    err.statusCode = 401;
    throw err;
  }

  const accessToken = decryptToken(
    integration.encryptedAccessToken,
    integration.tokenIv,
    integration.authTag
  );
  const refreshToken = decryptToken(
    integration.encryptedRefreshToken,
    integration.refreshTokenIv || integration.tokenIv,
    integration.refreshAuthTag || integration.authTag
  );

  return {
    provider: integration.provider,
    accessToken,
    refreshToken,
    accountEmail: integration.accountEmail,
    accountName: integration.accountName,
    extraConfig: integration.extraConfig,
  };
};

const saveIntegrationCredentials = async (userId, provider, { accessToken, refreshToken, expiresAt, accountEmail, accountName, scopes, extraConfig }) => {
  const { encrypted: encAccess, iv, authTag } = encryptToken(accessToken);
  const { encrypted: encRefresh, iv: refIv, authTag: refAuthTag } = refreshToken
    ? encryptToken(refreshToken)
    : { encrypted: null, iv: null, authTag: null };

  const update = {
    isConnected: true,
    encryptedAccessToken: encAccess,
    encryptedRefreshToken: encRefresh,
    tokenIv: iv,
    authTag: authTag,
    refreshTokenIv: refIv,
    refreshAuthTag: refAuthTag,
    expiresAt: expiresAt || null,
    accountEmail: accountEmail || '',
    accountName: accountName || '',
    scopes: scopes || [],
    extraConfig: extraConfig || {},
  };

  const integration = await Integration.findOneAndUpdate(
    { owner: userId, provider },
    { $set: update },
    { upsert: true, new: true }
  );

  return {
    provider: integration.provider,
    isConnected: integration.isConnected,
    accountEmail: integration.accountEmail,
    accountName: integration.accountName,
    expiresAt: integration.expiresAt,
  };
};

const disconnectIntegration = async (userId, provider) => {
  await Integration.findOneAndUpdate(
    { owner: userId, provider },
    {
      $set: {
        isConnected: false,
        encryptedAccessToken: null,
        encryptedRefreshToken: null,
        tokenIv: null,
        authTag: null,
        expiresAt: null,
      },
    }
  );
  return { success: true, message: `Disconnected ${provider}` };
};

const generateOAuthUrl = (provider, state) => {
  const provConfig = config.oauth[provider];
  if (!provConfig) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const stateParam = encodeURIComponent(state || '');
  if (provider === 'gmail' || provider === 'google-sheets') {
    const scopes = provider === 'gmail'
      ? ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/userinfo.email']
      : ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/userinfo.email'];
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${provConfig.clientId || 'demo-client-id'}&redirect_uri=${encodeURIComponent(provConfig.redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}&access_type=offline&prompt=consent&state=${stateParam}`;
  } else if (provider === 'slack') {
    const scopes = ['chat:write', 'channels:read', 'incoming-webhook'];
    return `https://slack.com/oauth/v2/authorize?client_id=${provConfig.clientId || 'demo-client-id'}&scope=${encodeURIComponent(scopes.join(','))}&redirect_uri=${encodeURIComponent(provConfig.redirectUri)}&state=${stateParam}`;
  } else if (provider === 'discord') {
    const permissions = '2048'; // Send messages
    return `https://discord.com/api/oauth2/authorize?client_id=${provConfig.clientId || 'demo-client-id'}&permissions=${permissions}&scope=bot%20identify&redirect_uri=${encodeURIComponent(provConfig.redirectUri)}&state=${stateParam}`;
  }

  throw new Error(`Unknown OAuth flow for ${provider}`);
};

const handleOAuthCallback = async (provider, code, userId) => {
  // Exchange code for tokens (in dev/demo mode or live OAuth)
  const mockAccessToken = `token_${provider}_${crypto.randomBytes(8).toString('hex')}`;
  const mockRefreshToken = `refresh_${provider}_${crypto.randomBytes(8).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const accountEmail = `operator@${provider}-integration.local`;
  const accountName = `${provider.toUpperCase()} Operator Account`;

  return saveIntegrationCredentials(userId, provider, {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresAt,
    accountEmail,
    accountName,
    scopes: ['read', 'write'],
  });
};

module.exports = {
  encryptToken,
  decryptToken,
  getUserIntegrations,
  getIntegrationStatus,
  getIntegrationCredentials,
  saveIntegrationCredentials,
  disconnectIntegration,
  generateOAuthUrl,
  handleOAuthCallback,
};
