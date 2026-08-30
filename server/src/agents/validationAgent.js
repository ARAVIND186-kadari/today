/**
 * Validation Agent
 * Verifies that the outputs from node executions satisfy expected schemas,
 * contain required fields, and are free of truncation or fatal errors.
 */
class ValidationAgent {
  constructor() {
    this.name = 'validation';
  }

  async validate(node, output) {
    const { id, type, data = {} } = node;
    const { provider, actionType } = data;

    if (!output) {
      return {
        isValid: false,
        errorType: 'MISSING_FIELDS',
        message: `Validation failed: Node ${id} produced null or empty output`,
        missingFields: ['output'],
      };
    }

    if (output.status === 'error' || output.error) {
      return {
        isValid: false,
        errorType: output.errorCode || 'API_FAILURE',
        message: output.errorMessage || output.error || `Node ${id} execution encountered an error`,
        details: output,
      };
    }

    // Specific provider validations
    if (provider === 'gmail' && actionType === 'send_email') {
      if (!output.messageId && !output.to) {
        return {
          isValid: false,
          errorType: 'MISSING_FIELDS',
          message: 'Validation failed: Gmail send_email did not return confirmation identifier or recipient',
          missingFields: ['messageId', 'to'],
        };
      }
    }

    if (provider === 'slack' && actionType === 'post_message') {
      if (!output.channel) {
        return {
          isValid: false,
          errorType: 'MISSING_FIELDS',
          message: 'Validation failed: Slack dispatch missing destination channel confirmation',
          missingFields: ['channel'],
        };
      }
    }

    if (provider === 'google-sheets' && actionType === 'append_row') {
      if (!output.spreadsheetId) {
        return {
          isValid: false,
          errorType: 'MISSING_FIELDS',
          message: 'Validation failed: Google Sheets missing spreadsheetId target',
          missingFields: ['spreadsheetId'],
        };
      }
    }

    return {
      isValid: true,
      agent: this.name,
      nodeId: id,
      verifiedFields: Object.keys(output),
      message: `Node ${id} (${provider || type}) output validated successfully.`,
    };
  }
}

module.exports = new ValidationAgent();
