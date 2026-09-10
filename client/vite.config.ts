import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, 'API_');
  const apiTarget = env.API_PROXY_TARGET ?? `http://localhost:${env.API_PORT ?? '3002'}`;

  return {
    plugins: [react()],
    server: { host: '0.0.0.0', port: 5173, proxy: { '/api': apiTarget } },
    preview: { host: '0.0.0.0', port: 4173 },
  };
});