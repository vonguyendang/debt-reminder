import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { CustomerRepository } from '@debt-reminder/db';
import { requireAuth } from '../lib/auth';
import { CreateCustomerSchema, UpdateCustomerSchema } from '@debt-reminder/shared';

export const customersRouter = new Router();

customersRouter.get('/api/customers', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const status = url.searchParams.get('status') || undefined;

  const repo = new CustomerRepository(env.DB);
  const data = await repo.list(page, 20, status);
  return successResponse(data);
});

customersRouter.get('/api/customers/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const repo = new CustomerRepository(env.DB);
  const data = await repo.findById(params.id);
  if (!data) return errorResponse("Not found", 404);
  return successResponse(data);
});

customersRouter.post('/api/customers', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = CreateCustomerSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new CustomerRepository(env.DB);
  const id = `cus_${crypto.randomUUID()}`;
  await repo.create(id, parsed.data);
  
  return successResponse({ id });
});

customersRouter.put('/api/customers/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = UpdateCustomerSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new CustomerRepository(env.DB);
  await repo.update(params.id, parsed.data);
  return successResponse({ success: true });
});

customersRouter.delete('/api/customers/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new CustomerRepository(env.DB);
  await repo.delete(params.id);
  return successResponse({ success: true });
});

