require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');
const config = require('./src/config/env');

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
  logger.info('='.repeat(50));
  logger.info('Philippine Government HRMS - Backend API');
  logger.info('='.repeat(50));
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API URL: ${config.appUrl}`);
  logger.info(`Health Check: ${config.appUrl}/api/health`);
  logger.info('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

