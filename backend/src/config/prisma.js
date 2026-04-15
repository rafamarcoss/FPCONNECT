// Configuración de Prisma Client
import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Log de queries en desarrollo
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Query: ${e.query}`, { duration: `${e.duration}ms` });
  }
});

// Manejo de desconexión
process.on('SIGINT', async () => {
  logger.info('Desconectando Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
