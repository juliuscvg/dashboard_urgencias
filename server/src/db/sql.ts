import sql from 'mssql';
import { getEnvironment } from '../config/env.js';

let pool: sql.ConnectionPool | undefined;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) return pool;
  const env = getEnvironment();
  pool = await new sql.ConnectionPool({
    server: env.DB_SERVER,
    database: env.DB_DATABASE,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    options: {
      encrypt: env.DB_ENCRYPT,
      trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
      enableArithAbort: true,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30_000 },
    requestTimeout: 120_000,
  }).connect();
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) await pool.close();
  pool = undefined;
}