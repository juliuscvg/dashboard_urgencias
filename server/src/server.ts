import { app } from './app.js';
import { getEnvironment } from './config/env.js';
import { closePool } from './db/sql.js';

const env = getEnvironment();
const server = app.listen(env.API_PORT, () => console.log(`Dashboard Urgencias API disponible en puerto ${env.API_PORT}`));
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(async () => {
    await closePool();
    process.exit(0);
  }));
}
