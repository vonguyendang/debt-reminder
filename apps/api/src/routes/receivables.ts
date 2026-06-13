import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { ReceivableRepository } from '@debt-reminder/db';
import { requireAuth } from '../lib/auth';
import { CreateReceivableSchema, UpdateReceivableSchema } from '@debt-reminder/shared';

export const receivablesRouter = new Router();

receivablesRouter.get('/api/receivables', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const url = new URL(req.url);
  const status = url.searchParams.get('status') || undefined;

  const repo = new ReceivableRepository(env.DB);
  const data = await repo.list(1, 100, status); 
  return successResponse(data);
});

receivablesRouter.post('/api/receivables', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = CreateReceivableSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new ReceivableRepository(env.DB);
  const id = `rec_${crypto.randomUUID()}`;
  await repo.create(id, parsed.data);
  return successResponse({ id });
});

receivablesRouter.put('/api/receivables/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = UpdateReceivableSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new ReceivableRepository(env.DB);
  await repo.update(params.id, parsed.data);
  return successResponse({ success: true });
});

receivablesRouter.post('/api/receivables/:id/mark-paid', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new ReceivableRepository(env.DB);
  await repo.markPaid(params.id);
  return successResponse({ success: true });
});

receivablesRouter.post('/api/receivables/:id/cancel', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new ReceivableRepository(env.DB);
  await repo.cancel(params.id);
  return successResponse({ success: true });
});

receivablesRouter.delete('/api/receivables/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new ReceivableRepository(env.DB);
  await repo.delete(params.id);
  return successResponse({ success: true });
});
