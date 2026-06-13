import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { JobsRepository } from '@debt-reminder/db';
import { requireAuth } from '../lib/auth';

export const jobsRouter = new Router();

jobsRouter.get('/api/jobs', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const repo = new JobsRepository(env.DB);
  return successResponse(await repo.getPendingJobsForDispatch(100));
});

jobsRouter.post('/api/jobs/:id/retry', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  await env.DB.prepare(`UPDATE reminder_jobs SET status = 'queued', attempt_count = 0 WHERE id = ?`).bind(params.id).run();
  return successResponse({ success: true });
});

jobsRouter.post('/api/jobs/:id/cancel', async (req, env, ctx, params) => {
  const user = await requireAuth(req, env);
  if (!user || user.role === 'viewer') return errorResponse("Unauthorized", 403);

  await env.DB.prepare(`UPDATE reminder_jobs SET status = 'cancelled' WHERE id = ?`).bind(params.id).run();
  return successResponse({ success: true });
});
