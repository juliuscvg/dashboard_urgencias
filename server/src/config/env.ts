import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../../.env') });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3002),
  DB_SERVER: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(1433),
  DB_ENCRYPT: z.string().default('false').transform((value) => value === 'true' || value === '1'),
  DB_TRUST_SERVER_CERTIFICATE: z.string().default('true').transform((value) => value === 'true' || value === '1'),
});

export type Environment = z.infer<typeof schema>;

let cached: Environment | undefined;

export function getEnvironment(): Environment {
  cached ??= schema.parse(process.env);
  return cached;
}