// Environment configuration
interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_LOGGING: boolean;
  ENABLE_DEBUG_MODE: boolean;
  
  // Performance Configuration
  DEBOUNCE_DELAY: number;
  THROTTLE_DELAY: number;
  CACHE_TTL: number;
  
  // Security Configuration
  JWT_EXPIRY: number;
  REFRESH_TOKEN_EXPIRY: number;
  MAX_LOGIN_ATTEMPTS: number;
  
  // UI Configuration
  THEME: 'light' | 'dark' | 'auto';
  LANGUAGE: string;
  TIMEZONE: string;
  
  // External Services
  GOOGLE_ANALYTICS_ID: string;
  SENTRY_DSN: string;
  STRIPE_PUBLIC_KEY: string;
}

// Development environment
const development: EnvironmentConfig = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5050',
  API_TIMEOUT: 10000,
  API_RETRY_ATTEMPTS: 3,
  
  ENABLE_ANALYTICS: false,
  ENABLE_LOGGING: true,
  ENABLE_DEBUG_MODE: true,
  
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  
  JWT_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  
  THEME: 'light',
  LANGUAGE: 'tr',
  TIMEZONE: 'Europe/Istanbul',
  
  GOOGLE_ANALYTICS_ID: '',
  SENTRY_DSN: '',
  STRIPE_PUBLIC_KEY: ''
};

// Production environment
const production: EnvironmentConfig = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://api.prota.com',
  API_TIMEOUT: 15000,
  API_RETRY_ATTEMPTS: 2,
  
  ENABLE_ANALYTICS: true,
  ENABLE_LOGGING: false,
  ENABLE_DEBUG_MODE: false,
  
  DEBOUNCE_DELAY: 500,
  THROTTLE_DELAY: 2000,
  CACHE_TTL: 15 * 60 * 1000, // 15 minutes
  
  JWT_EXPIRY: 2 * 60 * 60 * 1000, // 2 hours
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  MAX_LOGIN_ATTEMPTS: 3,
  
  THEME: 'auto',
  LANGUAGE: 'tr',
  TIMEZONE: 'Europe/Istanbul',
  
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GA_ID || '',
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_KEY || ''
};

// Test environment
const test: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:5050',
  API_TIMEOUT: 5000,
  API_RETRY_ATTEMPTS: 1,
  
  ENABLE_ANALYTICS: false,
  ENABLE_LOGGING: false,
  ENABLE_DEBUG_MODE: true,
  
  DEBOUNCE_DELAY: 0,
  THROTTLE_DELAY: 0,
  CACHE_TTL: 0,
  
  JWT_EXPIRY: 60 * 60 * 1000, // 1 hour
  REFRESH_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 1 day
  MAX_LOGIN_ATTEMPTS: 10,
  
  THEME: 'light',
  LANGUAGE: 'tr',
  TIMEZONE: 'UTC',
  
  GOOGLE_ANALYTICS_ID: '',
  SENTRY_DSN: '',
  STRIPE_PUBLIC_KEY: ''
};

// Get current environment
const getEnvironment = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV;
  
  switch (nodeEnv) {
    case 'production':
      return production;
    case 'test':
      return test;
    case 'development':
    default:
      return development;
  }
};

// Export current configuration
export const config = getEnvironment();

// Export individual configurations for testing
export { development, production, test };

// Utility functions
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
export const isTest = (): boolean => process.env.NODE_ENV === 'test';

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof Pick<EnvironmentConfig, 'ENABLE_ANALYTICS' | 'ENABLE_LOGGING' | 'ENABLE_DEBUG_MODE'>): boolean => {
  return config[feature];
};

// API configuration helpers
export const getApiConfig = () => ({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  retryAttempts: config.API_RETRY_ATTEMPTS
});

// Performance configuration helpers
export const getPerformanceConfig = () => ({
  debounceDelay: config.DEBOUNCE_DELAY,
  throttleDelay: config.THROTTLE_DELAY,
  cacheTTL: config.CACHE_TTL
});

// Security configuration helpers
export const getSecurityConfig = () => ({
  jwtExpiry: config.JWT_EXPIRY,
  refreshTokenExpiry: config.REFRESH_TOKEN_EXPIRY,
  maxLoginAttempts: config.MAX_LOGIN_ATTEMPTS
});

// UI configuration helpers
export const getUIConfig = () => ({
  theme: config.THEME,
  language: config.LANGUAGE,
  timezone: config.TIMEZONE
});

// External services configuration helpers
export const getExternalServicesConfig = () => ({
  googleAnalyticsId: config.GOOGLE_ANALYTICS_ID,
  sentryDsn: config.SENTRY_DSN,
  stripePublicKey: config.STRIPE_PUBLIC_KEY
});

// Environment validation
export const validateEnvironment = (): void => {
  const requiredEnvVars = [
    'REACT_APP_API_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0 && isProduction()) {
    console.warn('Missing required environment variables:', missingVars);
  }
};

// Initialize environment validation
validateEnvironment();
