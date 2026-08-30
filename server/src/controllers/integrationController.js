const integrationService = require('../services/integrationService');

const list = async (req, res, next) => {
  try {
    const integrations = await integrationService.getUserIntegrations(req.user.id);
    res.status(200).json({ success: true, data: integrations });
  } catch (err) {
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const status = await integrationService.getIntegrationStatus(req.user.id);
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
};

const startOAuth = (req, res, next) => {
  try {
    const { provider } = req.params;
    const state = req.user ? req.user.id : 'anonymous';
    const redirectUrl = integrationService.generateOAuthUrl(provider, state);
    res.json({ success: true, redirectUrl });
  } catch (err) {
    next(err);
  }
};

const oauthCallback = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.query;
    const userId = req.user?.id || state;

    if (!userId) {
      return res.redirect(`/integrations?error=missing_user_state`);
    }

    await integrationService.handleOAuthCallback(provider, code, userId);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/integrations?connected=${provider}`);
  } catch (err) {
    console.error('[OAuth Callback Error]', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent(err.message)}`);
  }
};

const oauthError = (req, res) => {
  res.status(400).json({
    success: false,
    message: 'OAuth authorization was cancelled or failed',
    error: req.query.error || 'Unknown OAuth Error',
  });
};

const saveManual = async (req, res, next) => {
  try {
    const { provider, accessToken, refreshToken, expiresAt, accountEmail, accountName, scopes, extraConfig } = req.body;
    if (!provider || !accessToken) {
      return res.status(400).json({ success: false, message: 'Provider and accessToken are required' });
    }

    const result = await integrationService.saveIntegrationCredentials(req.user.id, provider, {
      accessToken,
      refreshToken,
      expiresAt,
      accountEmail,
      accountName,
      scopes,
      extraConfig,
    });

    res.status(200).json({
      success: true,
      message: `Credentials for ${provider} saved securely`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const disconnect = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const result = await integrationService.disconnectIntegration(req.user.id, provider);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getStatus,
  startOAuth,
  oauthCallback,
  oauthError,
  saveManual,
  disconnect,
};
