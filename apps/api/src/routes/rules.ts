import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { RulesRepository } from '@debt-reminder/db';
import { requireAuth } from '../lib/auth';
import { CreateRuleSchema, UpdateRuleSchema } from '@debt-reminder/shared';

export const rulesRouter = new Router();

rulesRouter.get('/api/rules', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const repo = new RulesRepository(env.DB);
  return successResponse(await repo.listAll());
});

rulesRouter.post('/api/rules', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = CreateRuleSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new RulesRepository(env.DB);
  const id = `rule_${crypto.randomUUID()}`;
  await repo.create(id, parsed.data);
  return successResponse({ id });
});

rulesRouter.put('/api/rules/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const body = await req.json();
  const parsed = UpdateRuleSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const repo = new RulesRepository(env.DB);
  await repo.update(params.id, parsed.data);
  return successResponse({ success: true });
});

rulesRouter.delete('/api/rules/:id', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  const repo = new RulesRepository(env.DB);
  await repo.delete(params.id);
  return successResponse({ success: true });
});
