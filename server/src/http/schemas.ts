import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida');
const base = {
  desde: isoDate,
  hasta: isoDate,
  centro: z.string().trim().min(1).max(20).optional(),
  codigoServicio: z.coerce.number().int().positive().optional(),
  corte: z.string().datetime({ offset: true }).optional(),
};

export const dashboardQuerySchema = z.object(base).superRefine((value, context) => {
  if (value.desde > value.hasta) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['hasta'], message: 'hasta debe ser igual o posterior a desde' });
  }
});

export const detailQuerySchema = z.object({
  ...base,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
}).superRefine((value, context) => {
  if (value.desde > value.hasta) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['hasta'], message: 'hasta debe ser igual o posterior a desde' });
  }
});

export const catalogQuerySchema = z.object({
  centro: z.string().trim().min(1).max(20).optional(),
});