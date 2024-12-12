import 'dotenv/config';
import fastify, { FastifyPluginAsync } from 'fastify';
import { AppInstance } from './types';
import cors from '@fastify/cors';
import { DatabaseConnection } from './db/connection';
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { envSchema } from './env';
import { salaryRoutes } from './modules/salary/salary.route';
import { AppError } from './utils/error';

const bootstrapAppPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
  const databaseConnection = new DatabaseConnection(fastify.env.DATABASE_URL);
  fastify.decorate('db', databaseConnection.db);
});

export async function bootstrapServer() {
  const app: AppInstance = fastify({ logger: true });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.httpCode).send({
        success: false,
        message: error.message,
        error: error.error,
      });
    } else {
      reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message,
        message: 'Unknown Error',
      });
    }
  });
  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      success: false,
      message: 'Not Found',
    });
  });

  await app.register(fastifyEnv, {
    confKey: 'env',
    schema: envSchema,
  });

  app.register(bootstrapAppPlugin);
  await app.register(cors);

  app.register(salaryRoutes);
  return app;
}
