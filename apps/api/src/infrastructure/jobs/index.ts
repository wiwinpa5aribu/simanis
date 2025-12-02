import { logger } from '../../shared/logger/winston.logger'
import { depreciationProcessor } from './processors/depreciation.processor'
import { createWorker, getQueue, QUEUE_NAMES } from './queue'

export const initializeJobs = async () => {
  try {
    logger.info('Attempting to initialize background jobs...')

    // Initialize queues
    const depreciationQueue = getQueue(QUEUE_NAMES.DEPRECIATION)

    // Initialize workers
    createWorker(QUEUE_NAMES.DEPRECIATION, depreciationProcessor)

    // Schedule recurring jobs
    // Depreciation job runs on the 1st of every month at 00:00
    await depreciationQueue.add(
      'monthly-depreciation',
      {},
      {
        repeat: {
          pattern: '0 0 1 * *',
        },
        jobId: 'monthly-depreciation', // Ensure unique job ID
      }
    )

    logger.info('✅ Background jobs initialized successfully')
  } catch (error) {
    logger.warn(
      '⚠️  Background jobs initialization failed (Redis may not be running). Server will continue without background jobs.',
      { error: (error as Error).message }
    )
    // Don't crash the app if Redis is not available, just log warning
  }
}
