import { Router } from 'express';
import { getPool } from '../db/sql.js';
import { asyncRoute } from '../middleware/error.js';
import { fetchCatalogs } from '../repository/urgencias.repository.js';
import { getDemand, getEpisodes, getFrequentation, getResolution, getSummary, getTriage } from '../service/urgencias.service.js';
import { catalogQuerySchema, dashboardQuerySchema, detailQuerySchema } from './schemas.js';

export const api = Router();
api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.get('/health/db', asyncRoute(async (_req, res) => {
  const result = await (await getPool()).request().query('SELECT DB_NAME() AS databaseName, GETDATE() AS observedAt');
  res.json({ status: 'ok', database: result.recordset[0]?.databaseName, observedAt: result.recordset[0]?.observedAt });
}));
api.get('/urgencias/filters', asyncRoute(async (req, res) => {
  const query = catalogQuerySchema.parse(req.query);
  res.json({ data: await fetchCatalogs(query.centro) });
}));
api.get('/urgencias/summary', asyncRoute(async (req, res) => {
  const filters = dashboardQuerySchema.parse(req.query);
  res.json({ data: await getSummary(filters), filters });
}));
api.get('/urgencias/demand', asyncRoute(async (req, res) => {
  const filters = dashboardQuerySchema.parse(req.query);
  res.json({ data: await getDemand(filters), filters });
}));

api.get('/urgencias/resolution', asyncRoute(async (req, res) => {
  const filters = dashboardQuerySchema.parse(req.query);
  res.json({ data: await getResolution(filters), filters });
}));
api.get('/urgencias/frequentation', asyncRoute(async (req, res) => {
  const filters = dashboardQuerySchema.parse(req.query);
  res.json({ data: await getFrequentation(filters), filters });
}));

api.get('/urgencias/triage', asyncRoute(async (req, res) => {
  const filters = dashboardQuerySchema.parse(req.query);
  res.json({ data: await getTriage(filters), filters });
}));
api.get('/urgencias/episodes', asyncRoute(async (req, res) => {
  const filters = detailQuerySchema.parse(req.query);
  res.json({ data: await getEpisodes(filters), filters });
}));
