/**
 * Recovery Agent
 * Analyzes execution errors, classifies failure mode (MISSING_FIELDS, API_FAILURE, AUTH_EXPIRED,
 * RATE_LIMIT, TRANSIENT) and decides the recovery policy: retry_with_backoff vs escalate.
 */
class RecoveryAgent {
  constructor() {
    this.name = 'recovery';
    this.maxRetries = 3;
  }

  classifyError(error) {
    const msg = (error?.message || error?.toString() || '').toLowerCase();
    const code = error?.code || error?.errorType || '';

    if (code === 'AUTH_EXPIRED' || msg.includes('auth_expired') || msg.includes('token expired') || msg.includes('401')) {
      return {
        category: 'AUTH_EXPIRED',
        action: 'escalate',
        reason: 'OAuth credential expired or revoked; operator re-authorization required.',
        shouldRetry: false,
        backoffDelayMs: 0,
      };
    }

    if (code === 'INTEGRATION_NOT_CONNECTED' || msg.includes('not connected')) {
      return {
        category: 'AUTH_EXPIRED',
        action: 'escalate',
        reason: 'Required integration is not connected in the operator console.',
        shouldRetry: false,
        backoffDelayMs: 0,
      };
    }

    if (msg.includes('rate limit') || msg.includes('429') || msg.includes('too many requests')) {
      return {
        category: 'RATE_LIMIT',
        action: 'retry_with_backoff',
        reason: 'Rate limit encountered. Applying exponential backoff.',
        shouldRetry: true,
        backoffDelayMs: 3000,
      };
    }

    if (code === 'MISSING_FIELDS' || msg.includes('missing_fields')) {
      return {
        category: 'MISSING_FIELDS',
        action: 'escalate',
        reason: 'Schema validation mismatch. Required output fields missing from payload.',
        shouldRetry: false,
        backoffDelayMs: 0,
      };
    }

    if (msg.includes('econnrefused') || msg.includes('timeout') || msg.includes('network') || msg.includes('socket')) {
      return {
        category: 'TRANSIENT',
        action: 'retry_with_backoff',
        reason: 'Transient network failure detected. Retrying request.',
        shouldRetry: true,
        backoffDelayMs: 1500,
      };
    }

    return {
      category: 'API_FAILURE',
      action: 'retry_with_backoff',
      reason: `Third-party service error: ${msg}`,
      shouldRetry: true,
      backoffDelayMs: 2000,
    };
  }

  evaluate(error, currentRetryCount = 0) {
    const classification = this.classifyError(error);

    if (classification.shouldRetry && currentRetryCount < this.maxRetries) {
      const delay = classification.backoffDelayMs * Math.pow(2, currentRetryCount);
      return {
        decision: 'retry_with_backoff',
        category: classification.category,
        retryCount: currentRetryCount + 1,
        maxRetries: this.maxRetries,
        delayMs: delay,
        explanation: `${classification.reason} (Attempt ${currentRetryCount + 1} of ${this.maxRetries}, waiting ${delay}ms)`,
      };
    }

    return {
      decision: 'escalate',
      category: classification.category,
      retryCount: currentRetryCount,
      explanation: `Execution escalated to operator: ${classification.reason}`,
      requiresOperatorAction: true,
    };
  }
}

module.exports = new RecoveryAgent();
