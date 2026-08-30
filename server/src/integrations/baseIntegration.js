/**
 * BaseIntegration class defining common interface for all third-party integrations
 */
class BaseIntegration {
  constructor(providerName) {
    this.providerName = providerName;
  }

  /**
   * Execute an action on the third party provider
   * @param {string} actionType - e.g. 'send_email', 'post_message'
   * @param {object} params - Input parameters for the action
   * @param {object} credentials - Decrypted credentials { accessToken, refreshToken, extraConfig }
   * @returns {Promise<object>} Execution output
   */
  async execute(actionType, params, credentials) {
    throw new Error(`execute method not implemented for provider ${this.providerName}`);
  }

  /**
   * Verify credentials health and connectivity
   * @param {object} credentials - Decrypted credentials
   * @returns {Promise<boolean>}
   */
  async testConnection(credentials) {
    return Boolean(credentials && credentials.accessToken);
  }
}

module.exports = BaseIntegration;
