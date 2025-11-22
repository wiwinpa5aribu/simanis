/**
 * Environment Variables Utility
 * 
 * Centralized access untuk environment variables dengan type safety
 */

export const env = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // Feature Flags
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'SIMANIS',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // PWA
  pwaEnabled: import.meta.env.VITE_PWA_ENABLED === 'true',

  // Development
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Type untuk environment variables
export type Env = typeof env;

// Helper function untuk log environment (development only)
export function logEnvironment() {
  if (env.isDev && env.enableLogging) {
    console.group('🔧 Environment Configuration');
    console.log('Mode:', env.mode);
    console.log('API Base URL:', env.apiBaseUrl);
    console.log('Use Mock API:', env.useMockApi);
    console.log('Logging Enabled:', env.enableLogging);
    console.log('PWA Enabled:', env.pwaEnabled);
    console.groupEnd();
  }
}
