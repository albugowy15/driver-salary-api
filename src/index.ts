import { bootstrapServer } from './server';

async function start() {
  const server = await bootstrapServer();
  try {
    await server.listen({ port: 5000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
