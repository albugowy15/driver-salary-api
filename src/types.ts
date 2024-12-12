import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Kysely } from 'kysely';
import { Database } from './db/schema';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<Database>;
    env: {
      DATABASE_URL: string;
    };
  }
}

export type AppInstance = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
>;
