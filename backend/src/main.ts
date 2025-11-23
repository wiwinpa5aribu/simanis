import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { config } from './shared/config';
import { logger } from './shared/logger/winston.logger';
import { errorHandler } from './presentation/middleware/error-handler.middleware';
import { loggerMiddleware } from './presentation/middleware/logger.middleware';
import { registerRoutes } from './presentation/routes';
import { initializeJobs } from './infrastructure/jobs';

async function bootstrap() {
    // Create Fastify instance
    const fastify = Fastify({
        logger: false, // Use Winston instead
    });

    try {
        // Register plugins
        await fastify.register(cors, {
            origin: config.cors.origin,
            credentials: true,
        });

        await fastify.register(multipart, {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        });

        import path from 'path';
        import fastifyStatic from '@fastify/static';

        // ... inside bootstrap function ...

        // Serve static files from uploads directory (for local storage)
        await fastify.register(fastifyStatic, {
            root: path.join(process.cwd(), 'uploads'),
            prefix: '/uploads/',
        });

        // Register global middleware
        fastify.addHook('preHandler', loggerMiddleware);

        // Register routes
        await registerRoutes(fastify);

        // Register error handler
        fastify.setErrorHandler(errorHandler);

        // Health check endpoint
        fastify.get('/health', async () => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });

        // Initialize background jobs
        await initializeJobs();

        // Start server
        const port = config.port;
        await fastify.listen({ port, host: '0.0.0.0' });

        logger.info(`🚀 Server running on http://localhost:${port}`);
        logger.info(`📝 Health check: http://localhost:${port}/health`);
        logger.info(`🔧 Environment: ${config.env}`);
    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down gracefully...');
    process.exit(0);
});

// Start application
bootstrap();
