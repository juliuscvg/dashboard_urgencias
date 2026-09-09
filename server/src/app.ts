import express from 'express';
import helmet from 'helmet';
import { api } from './http/routes.js';
import { errorHandler } from './middleware/error.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '32kb' }));
app.use('/api', api);
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler);
