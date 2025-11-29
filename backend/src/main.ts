import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './shared/config';
import { logger } from './shared/logger/winston.logger';
import { errorHandler } from './presentation/middleware/error-handler.middleware';
import { loggerMiddleware } from './presentation/middleware/logger.middleware';
import { registerRoutes } from './presentation/routes';
// import { initializeJobs } from './infrastructure/jobs';

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

    // Register Swagger for API documentation
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'SIMANIS API',
          description: 'API Documentation untuk Sistem Manajemen Aset Sekolah',
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://localhost:${config.port}`,
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Assets', description: 'Asset management endpoints' },
          { name: 'Categories', description: 'Category management endpoints' },
          { name: 'Loans', description: 'Loan management endpoints' },
          { name: 'Inventory', description: 'Inventory check endpoints' },
          { name: 'Depreciation', description: 'Depreciation endpoints' },
          { name: 'Reports', description: 'Report generation endpoints' },
          { name: 'Users', description: 'User management endpoints' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
    });

    // Register global middleware
    fastify.addHook('preHandler', loggerMiddleware);

    // Register routes
    await registerRoutes(fastify);

    // Register error handler
    fastify.setErrorHandler(errorHandler);

    // Health check endpoint
    fastify.get('/health', async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env.npm_package_version || '1.0.0',
      };
    });

    // Initialize background jobs (disabled for testing)
    // await initializeJobs();

    // Start server
    const port = config.port;
    await fastify.listen({ port, host: '0.0.0.0' });

    logger.info(`🚀 Server running on http://localhost:${port}`);
    logger.info(`�  API Docs: http://localhost:${port}/docs`);
    logger.info(`� EHealth check: http://localhost:${port}/health`);
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
