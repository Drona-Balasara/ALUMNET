const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const logger = require('../utils/logger');

class SecretsManager {
  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getSecret(secretName) {
    try {
      // Check cache first
      const cached = this.cache.get(secretName);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }

      const command = new GetSecretValueCommand({
        SecretId: secretName
      });

      const response = await this.client.send(command);
      const secretValue = JSON.parse(response.SecretString);

      // Cache the secret
      this.cache.set(secretName, {
        value: secretValue,
        timestamp: Date.now()
      });

      return secretValue;
    } catch (error) {
      logger.error(`Error retrieving secret ${secretName}:`, error);
      throw error;
    }
  }

  async getSecretValue(secretName, key) {
    try {
      const secrets = await this.getSecret(secretName);
      return secrets[key];
    } catch (error) {
      logger.error(`Error retrieving secret value ${key} from ${secretName}:`, error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

const secretsManager = new SecretsManager();

const loadSecrets = async () => {
  try {
    // Only load from AWS Secrets Manager in production
    if (process.env.NODE_ENV === 'production') {
      const secrets = await secretsManager.getSecret('alumnet/prod');
      
      // Set environment variables from secrets
      process.env.MONGO_URI = secrets.MONGO_URI;
      process.env.JWT_SECRET = secrets.JWT_SECRET;
      process.env.OPENAI_API_KEY = secrets.OPENAI_API_KEY;
      process.env.GITHUB_CLIENT_ID = secrets.GITHUB_CLIENT_ID;
      process.env.GITHUB_CLIENT_SECRET = secrets.GITHUB_CLIENT_SECRET;
      
      logger.info('Secrets loaded from AWS Secrets Manager');
    } else {
      logger.info('Using environment variables for development');
    }
  } catch (error) {
    logger.error('Error loading secrets:', error);
    // In development, continue with environment variables
    if (process.env.NODE_ENV !== 'production') {
      logger.warn('Continuing with environment variables');
    } else {
      throw error;
    }
  }
};

module.exports = { secretsManager, loadSecrets };