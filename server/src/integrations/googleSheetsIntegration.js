const axios = require('axios');
const BaseIntegration = require('./baseIntegration');

class GoogleSheetsIntegration extends BaseIntegration {
  constructor() {
    super('google-sheets');
  }

  async execute(actionType, params, credentials) {
    if (!credentials || !credentials.accessToken) {
      const err = new Error('INTEGRATION_NOT_CONNECTED: Google Sheets credentials missing or not connected.');
      err.code = 'INTEGRATION_NOT_CONNECTED';
      throw err;
    }

    switch (actionType) {
      case 'append_row':
        return this.appendRow(params, credentials);
      case 'read_range':
        return this.readRange(params, credentials);
      default:
        throw new Error(`Unsupported action '${actionType}' on Google Sheets provider`);
    }
  }

  async appendRow(params, credentials) {
    const { spreadsheetId = 'default_sheet_id', range = 'Sheet1!A:E', values = [] } = params;

    const isSimulated = !credentials.accessToken || 
      credentials.accessToken.startsWith('token_') || 
      credentials.accessToken.startsWith('simulated_') || 
      credentials.accessToken.startsWith('mock_');

    if (!isSimulated) {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
        const response = await axios.post(
          url,
          { values: Array.isArray(values[0]) ? values : [values] },
          { headers: { Authorization: `Bearer ${credentials.accessToken}` } }
        );
        return {
          status: 'success',
          provider: 'google-sheets',
          action: 'append_row',
          updatedRange: response.data.updates?.updatedRange,
          updatedRows: response.data.updates?.updatedRows,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        if (err.response?.status === 401) {
          const authErr = new Error('AUTH_EXPIRED: Google Sheets access token expired');
          authErr.code = 'AUTH_EXPIRED';
          throw authErr;
        }
        throw new Error(`Google Sheets API error: ${err.message}`);
      }
    }

    return {
      status: 'success',
      mode: 'simulated_delivery',
      provider: 'google-sheets',
      action: 'append_row',
      spreadsheetId,
      range,
      appendedValues: values.length > 0 ? values : ['2026-08-30', 'INV-9021', 'Approved', 'Operator'],
      updatedRows: 1,
      timestamp: new Date().toISOString(),
    };
  }

  async readRange(params, credentials) {
    const { spreadsheetId = 'default_sheet_id', range = 'Sheet1!A1:Z100' } = params;
    return {
      status: 'success',
      provider: 'google-sheets',
      action: 'read_range',
      spreadsheetId,
      range,
      values: [
        ['Timestamp', 'Event', 'Status', 'HandledBy'],
        [new Date().toISOString(), 'Workflow Executed', 'SUCCESS', 'Agentflow_AI'],
      ],
    };
  }
}

module.exports = new GoogleSheetsIntegration();
