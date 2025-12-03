import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  // Initialize if DSN is provided (works in both dev and prod)
  if (dsn) {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 100% in dev, 10% in prod
      // Session Replay
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
      replaysOnErrorSampleRate: 1.0, // 100% when error occurs
      // Only send errors in production, log in development
      beforeSend(event) {
        if (import.meta.env.DEV) {
          console.log('[Sentry] Would send event:', event)
        }
        return event
      },
    })

    console.log(`[Sentry] Initialized in ${import.meta.env.MODE} mode`)
  }
}

export { Sentry }
