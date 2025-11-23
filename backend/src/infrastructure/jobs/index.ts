import { getQueue, createWorker, QUEUE_NAMES } from './queue';
import { depreciationProcessor } from './processors/depreciation.processor';
import { logger } from '../../shared/logger/winston.logger';

export const initializeJobs = async () => {
    try {
        // Initialize queues
        const depreciationQueue = getQueue(QUEUE_NAMES.DEPRECIATION);

        // Initialize workers
        createWorker(QUEUE_NAMES.DEPRECIATION, depreciationProcessor);

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
        );

        logger.info('Background jobs initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize background jobs', { error });
        // Don't crash the app if Redis is not available, just log error
    }
};
