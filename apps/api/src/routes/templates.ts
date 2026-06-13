import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { TemplatesRepository } from '@debt-reminder/db';
import { requireAuth } from '../lib/auth';
import { CreateTemplateSchema, UpdateTemplateSchema } from '@debt-reminder/shared';

export const templatesRouter = new Router();

templatesRouter.get('/api/templates', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const repo = new TemplatesRepository(env.DB);
  return successResponse(await repo.listAll());
});

templatesRouter.post('/api/templates', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = CreateTemplateSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new TemplatesRepository(env.DB);
  const id = `tpl_${crypto.randomUUID()}`;
  await repo.create(id, parsed.data);
  return successResponse({ id });
});

templatesRouter.put('/api/templates/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = UpdateTemplateSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new TemplatesRepository(env.DB);
  await repo.update(params.id, parsed.data);
  return successResponse({ success: true });
});

templatesRouter.delete('/api/templates/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new TemplatesRepository(env.DB);
  await repo.delete(params.id);
  return successResponse({ success: true });
});
