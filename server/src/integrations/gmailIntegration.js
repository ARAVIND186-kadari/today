const axios = require('axios');
const BaseIntegration = require('./baseIntegration');

class GmailIntegration extends BaseIntegration {
  constructor() {
    super('gmail');
  }

  async execute(actionType, params, credentials) {
    if (!credentials || !credentials.accessToken) {
      const err = new Error('INTEGRATION_NOT_CONNECTED: Gmail credentials missing or not connected.');
      err.code = 'INTEGRATION_NOT_CONNECTED';
      throw err;
    }

    switch (actionType) {
      case 'send_email':
        return this.sendEmail(params, credentials);
      case 'read_email':
        return this.readEmail(params, credentials);
      default:
        throw new Error(`Unsupported action '${actionType}' on Gmail provider`);
    }
  }

  async sendEmail(params, credentials) {
    const { to, subject, body, bodyTemplate } = params;
    const finalBody = body || bodyTemplate || 'Notification from Agentflow_AI';
    const finalTo = to || 'recipient@example.com';
    const finalSubject = subject || 'Agentflow_AI Notification';

    // If using real Google OAuth token
    const isSimulated = !credentials.accessToken || 
      credentials.accessToken.startsWith('token_') || 
      credentials.accessToken.startsWith('simulated_') || 
      credentials.accessToken.startsWith('mock_');

    if (!isSimulated) {
      try {
        const rawMessage = [
          `To: ${finalTo}`,
          `Subject: ${finalSubject}`,
          'Content-Type: text/plain; charset=utf-8',
          '',
          finalBody,
        ].join('\r\n');

        const encodedMessage = Buffer.from(rawMessage).toString('base64url');

        const response = await axios.post(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          { raw: encodedMessage },
          { headers: { Authorization: `Bearer ${credentials.accessToken}` } }
        );
        return {
          status: 'success',
          provider: 'gmail',
          action: 'send_email',
          messageId: response.data.id,
          to: finalTo,
          subject: finalSubject,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        if (err.response?.status === 401) {
          const authErr = new Error('AUTH_EXPIRED: Gmail access token expired');
          authErr.code = 'AUTH_EXPIRED';
          throw authErr;
        }
        throw new Error(`Gmail API error: ${err.response?.data?.error?.message || err.message}`);
      }
    }

    // Simulated sandbox response
    return {
      status: 'success',
      mode: 'simulated_delivery',
      provider: 'gmail',
      action: 'send_email',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      to: finalTo,
      subject: finalSubject,
      preview: finalBody.substring(0, 100),
      timestamp: new Date().toISOString(),
    };
  }

  async readEmail(params, credentials) {
    const { query = 'is:unread', maxResults = 5 } = params;
    return {
      status: 'success',
      provider: 'gmail',
      action: 'read_email',
      query,
      messages: [
        {
          id: 'sim_msg_001',
          from: 'client@partner.org',
          subject: 'Priority Invoice Processing Request',
          snippet: 'Please find attached invoice #INV-2026-99 for immediate automated settlement.',
          date: new Date().toISOString(),
        },
      ],
      count: 1,
    };
  }
}

module.exports = new GmailIntegration();
