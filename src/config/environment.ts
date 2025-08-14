/**
 * Environment Configuration
 * 
 * This file centralizes all environment variables used in the application.
 * All environment variables must be prefixed with REACT_APP_ to be accessible
 * in the browser during runtime.
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://admin-viencn.anf-technology.com/api/v1',
  },
  
  // Application Configuration
  app: {
    name: process.env.REACT_APP_NAME || 'Viện Công Nghệ',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    debug: process.env.REACT_APP_DEBUG === 'true',
  },
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Type-safe environment configuration
export type Config = typeof config;

// Validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = [
    'REACT_APP_API_BASE_URL',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(
      'Missing environment variables:',
      missingVars.join(', '),
      '\nPlease check your .env file.'
    );
  }
};

// Export individual config sections for convenience
export const { api, app } = config;
