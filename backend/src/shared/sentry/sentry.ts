/**
 * Sentry Configuration for Backend
 * Error tracking dan performance monitoring
 */

import * as Sentry from '@sentry/node';
import { config } from '../config';

export function initSentry(): void {
  // Only initialize if DSN is provided
  const dsn = process.env.SENTRY_DSN_BACKEND;

  if (!dsn) {
    console.log('⚠️  Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: config.env,
    release: `simanis-backend@${process.env.npm_package_version || '1.0.0'}`,

    // Performance monitoring
    tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,

    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'ECONNREFUSED', // Redis connection errors in dev
      'ENOTFOUND',
    ],
  });

  console.log('✅ Sentry initialized for error tracking');
}

/**
 * Capture exception dengan context tambahan
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });
}

/**
 * Capture message untuk logging penting
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context untuk tracking
 */
export function setUserContext(user: { id: number; username: string }): void {
  Sentry.setUser({
    id: user.id.toString(),
    username: user.username,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

export { Sentry };
