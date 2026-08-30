const axios = require('axios');
const BaseIntegration = require('./baseIntegration');

class DiscordIntegration extends BaseIntegration {
  constructor() {
    super('discord');
  }

  async execute(actionType, params, credentials) {
    if (!credentials || !credentials.accessToken) {
      const err = new Error('INTEGRATION_NOT_CONNECTED: Discord credentials missing or not connected.');
      err.code = 'INTEGRATION_NOT_CONNECTED';
      throw err;
    }

    switch (actionType) {
      case 'post_message':
        return this.postMessage(params, credentials);
      default:
        throw new Error(`Unsupported action '${actionType}' on Discord provider`);
    }
  }

  async postMessage(params, credentials) {
    const { channel = 'general', message = 'Agentflow_AI Discord Alert', embed } = params;

    // In live bot token mode or webhook URL
    if (credentials.extraConfig?.webhookUrl) {
      try {
        await axios.post(credentials.extraConfig.webhookUrl, {
          content: message,
          embeds: embed ? [embed] : undefined,
        });
        return {
          status: 'success',
          provider: 'discord',
          action: 'post_message',
          channel,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        throw new Error(`Discord Webhook error: ${err.message}`);
      }
    }

    return {
      status: 'success',
      mode: 'simulated_delivery',
      provider: 'discord',
      action: 'post_message',
      channel,
      message,
      messageId: `disc_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new DiscordIntegration();
