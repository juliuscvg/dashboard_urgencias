import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export const asyncRoute = (handler: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Solicitud inválida', issues: error.issues });
    return;
  }
  const message = error instanceof Error ? error.message : 'Error interno';
  console.error(message);
  res.status(500).json({ error: 'No fue posible completar la consulta.' });
};