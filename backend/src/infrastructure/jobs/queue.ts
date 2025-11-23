import { Queue, Worker, Job } from 'bullmq';
import { config } from '../../shared/config';
import { logger } from '../../shared/logger/winston.logger';

const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};

export const QUEUE_NAMES = {
    DEPRECIATION: 'depreciation-queue',
    REPORTS: 'reports-queue',
};

const queues: Record<string, Queue> = {};

export const getQueue = (name: string): Queue => {
    if (!queues[name]) {
        queues[name] = new Queue(name, { connection });
        logger.info(`Queue ${name} initialized`);
    }
    return queues[name];
};

export const createWorker = (name: string, processor: (job: Job) => Promise<any>) => {
    const worker = new Worker(name, processor, { connection });

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} in queue ${name} completed`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job?.id} in queue ${name} failed`, { error: err });
    });

    logger.info(`Worker for ${name} initialized`);
    return worker;
};

export const closeQueues = async () => {
    for (const queue of Object.values(queues)) {
        await queue.close();
    }
};
