// ArmorIQ Policy Gate & Shield Wrapper for Sicura AI
import crypto from 'crypto';

// Try to import ArmorIQClient from SDK
let ArmorIQClient;
try {
  const sdkModule = await import('@armoriq/sdk');
  ArmorIQClient = sdkModule.ArmorIQClient;
} catch (err) {
  console.log('Using simulated ArmorIQClient due to SDK import behavior or mock status.');
}

const MOCK_SECRET_KEY = 'sicura_ai_secret_cryptographic_signing_key_for_intent_tokens';

// Standard allowed tools for Sicura AI security workspace
const ALLOWED_TOOLS = [
  'url_parser',
  'whois_client',
  'threat_intel_api',
  'link_sandbox',
  'text_scanner',
  'entity_analyzer',
  'sentiment_classifier'
];

/**
 * Initializes and executes the ArmorIQ verification workflow.
 */
export class ArmorIQShield {
  constructor(apiKey, userId = 'user_demo_123', agentId = 'agent_sicura_v1') {
    this.apiKey = apiKey || 'ak_demo_mode';
    this.userId = userId;
    this.agentId = agentId;
    this.isMock = !apiKey || apiKey === 'ak_demo_mode';
    
    if (!this.isMock && ArmorIQClient) {
      try {
        this.client = new ArmorIQClient({
          apiKey: this.apiKey,
          userId: this.userId,
          agentId: this.agentId
        });
      } catch (err) {
        console.warn('Failed to initialize live ArmorIQ SDK, defaulting to Simulator:', err.message);
        this.isMock = true;
      }
    }
  }

  /**
   * Captures and canonicalizes the agent's planned execution steps.
   * @param {string} llm Model name
   * @param {string} prompt Original user request
   * @param {object} plan Structured plan
   */
  async capturePlan(llm, prompt, plan) {
    if (!this.isMock && this.client) {
      try {
        return await this.client.capturePlan(llm, prompt, plan);
      } catch (err) {
        console.warn('capturePlan failed on live platform, using simulator fallback:', err.message);
      }
    }

    // Simulator implementation of capturePlan
    const captureId = 'cap_' + crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    
    return {
      captureId,
      timestamp,
      llm,
      prompt,
      plan,
      status: 'CAPTURED'
    };
  }

  /**
   * Evaluates the plan against security policies and mints a signed intent token.
   * Throws an error (fails closed) if a policy violation occurs.
   * @param {object} planCapture The captured plan return value
   */
  async getIntentToken(planCapture) {
    if (!this.isMock && this.client) {
      try {
        return await this.client.getIntentToken(planCapture);
      } catch (err) {
        console.warn('getIntentToken failed on live platform, using simulator fallback:', err.message);
      }
    }

    // Simulator Policy Check and Token Generation
    const { prompt, plan } = planCapture;
    
    // 1. Evaluate Prompt Injection in User input
    const injectionRegex = /(ignore.*instruct|system.*override|bypass.*armoriq|execute.*cmd|run.*system)/i;
    if (injectionRegex.test(prompt) || plan.isCompromised) {
      throw new Error('POLICY_VIOLATION: Prompt Injection Detected. The request attempted to manipulate agent instructions or hijack system processes.');
    }

    // 2. Evaluate Forbidden Tools and Intent Drift in plan steps
    const steps = plan.steps || [];
    for (const step of steps) {
      // Check if tool is allowed
      if (!ALLOWED_TOOLS.includes(step.tool)) {
        throw new Error(`POLICY_VIOLATION: Unauthorized Tool Execution. Tool '${step.tool}' is not registered in the Sicura security policy gate. Intent drift detected.`);
      }

      // Check if action tries to run destructive tasks
      if (/override|terminal|delete|shell|exec|bypass/i.test(step.action)) {
        throw new Error(`POLICY_VIOLATION: Destructive Action Denied. Action '${step.action}' violates system sandbox parameters.`);
      }
    }

    // 3. If plan passes all policies, generate signed token
    const tokenPayload = {
      captureId: planCapture.captureId,
      agentId: this.agentId,
      allowedSteps: steps.map(s => s.action),
      issuedAt: Date.now(),
      expiresAt: Date.now() + 60000 // 1 minute validity
    };

    const payloadStr = JSON.stringify(tokenPayload);
    const signature = crypto.createHmac('sha256', MOCK_SECRET_KEY).update(payloadStr).digest('hex');

    // Return token containing payload + signature
    return Buffer.from(JSON.stringify({ payload: tokenPayload, signature })).toString('base64');
  }

  /**
   * Enforces tool execution at runtime.
   * Checks if the token is valid, matches the action, and signature holds.
   * @param {string} token Cryptographically signed token
   * @param {string} action Action being executed
   */
  verifyTokenForAction(token, action) {
    try {
      if (!token) {
        throw new Error('FAIL_CLOSED: Missing cryptographically signed Intent Token.');
      }

      // Parse token
      const rawToken = Buffer.from(token, 'base64').toString('utf-8');
      const { payload, signature } = JSON.parse(rawToken);

      // Verify signature
      const expectedSignature = crypto.createHmac('sha256', MOCK_SECRET_KEY).update(JSON.stringify(payload)).digest('hex');
      if (signature !== expectedSignature) {
        throw new Error('FAIL_CLOSED: Cryptographic signature mismatch. Token has been tampered with.');
      }

      // Verify expiration
      if (Date.now() > payload.expiresAt) {
        throw new Error('FAIL_CLOSED: Intent Token expired.');
      }

      // Verify action is allowed
      if (!payload.allowedSteps.includes(action)) {
        throw new Error(`FAIL_CLOSED: Action '${action}' is not authorized by the signed Intent Token footprint.`);
      }

      return {
        verified: true,
        payload
      };
    } catch (err) {
      throw new Error(`ENFORCEMENT_FAILURE: ${err.message}`);
    }
  }

  /**
   * Formulates an audit log entry for tamper-evident history.
   */
  createAuditTrail(planCapture, token, status, errorMsg = null) {
    const auditRecord = {
      auditId: 'aud_' + crypto.randomBytes(12).toString('hex'),
      timestamp: new Date().toISOString(),
      agentId: this.agentId,
      userId: this.userId,
      prompt: planCapture.prompt,
      plan: planCapture.plan,
      intentToken: token ? token.substring(0, 24) + '...' : null,
      status,
      errorMsg,
      verifiedHash: crypto.createHash('sha256').update(JSON.stringify({
        prompt: planCapture.prompt,
        plan: planCapture.plan,
        status,
        errorMsg
      })).digest('hex')
    };

    return auditRecord;
  }
}
