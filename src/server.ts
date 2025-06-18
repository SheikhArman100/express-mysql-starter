import { Server } from 'http';

import app from './app';
import { prisma } from './client';
import config from './config/index';
import logger from './shared/logger';

let server: Server;

/**
 * connect MySQL with Prisma and API
 */
async function main() {
  try {
    // Connect to MySQL using Prisma
    await prisma.$connect();
    logger.info('Database connection established successfully');

    server = app.listen(config.port, () => {
      logger.info(`Server started successfully on port ${config.port}`);
    });
  } catch (error) {
    logger.info('Failed to connect database', { error });
    throw error;
  }

  process.on('unhandledRejection', error => {
    logger.info('Unhandled Rejection', { error });
    if (server) {
      server.close(() => {
        logger.info('Server closed due to unhandled rejection', { error });
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    }
  });
}

const start = async (): Promise<void> => {
  try {
    await main();
  } catch (err) {
    logger.info('Failed to start application', { error: err });
    process.exit(1);
  }
};

start();
