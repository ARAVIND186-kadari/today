const axios = require('axios');
const BaseIntegration = require('./baseIntegration');

class SlackIntegration extends BaseIntegration {
  constructor() {
    super('slack');
  }

  async execute(actionType, params, credentials) {
    if (!credentials || !credentials.accessToken) {
      const err = new Error('INTEGRATION_NOT_CONNECTED: Slack credentials missing or not connected.');
      err.code = 'INTEGRATION_NOT_CONNECTED';
      throw err;
    }

    switch (actionType) {
      case 'post_message':
        return this.postMessage(params, credentials);
      case 'list_channels':
        return this.listChannels(params, credentials);
      default:
        throw new Error(`Unsupported action '${actionType}' on Slack provider`);
    }
  }

  async postMessage(params, credentials) {
    const { channel = '#general', message = 'Agentflow_AI notification' } = params;

    const isSimulated = !credentials.accessToken || 
      credentials.accessToken.startsWith('token_') || 
      credentials.accessToken.startsWith('simulated_') || 
      credentials.accessToken.startsWith('mock_') ||
      credentials.accessToken.startsWith('xoxb-test');

    if (!isSimulated) {
      try {
        const response = await axios.post(
          'https://slack.com/api/chat.postMessage',
          { channel, text: message },
          { headers: { Authorization: `Bearer ${credentials.accessToken}` } }
        );
        if (!response.data.ok) {
          throw new Error(`Slack API error: ${response.data.error}`);
        }
        return {
          status: 'success',
          provider: 'slack',
          action: 'post_message',
          channel,
          ts: response.data.ts,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        if (err.response?.status === 401) {
          const authErr = new Error('AUTH_EXPIRED: Slack access token expired');
          authErr.code = 'AUTH_EXPIRED';
          throw authErr;
        }
        throw new Error(`Slack API error: ${err.message}`);
      }
    }

    return {
      status: 'success',
      mode: 'simulated_delivery',
      provider: 'slack',
      action: 'post_message',
      channel,
      message,
      ts: `${Date.now() / 1000}`,
      timestamp: new Date().toISOString(),
    };
  }

  async listChannels(params, credentials) {
    return {
      status: 'success',
      provider: 'slack',
      channels: ['#general', '#operations', '#alerts', '#dev-team'],
    };
  }
}

module.exports = new SlackIntegration();
