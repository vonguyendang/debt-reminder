import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { requireAuth } from '../lib/auth';
import { runScheduler, runDispatcher } from '@debt-reminder/core';

export const adminRouter = new Router();

adminRouter.post('/api/admin/run-scheduler-now', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role !== 'admin') return errorResponse("Unauthorized", 403);

  await runScheduler(env.DB);
  return successResponse({ success: true });
});

adminRouter.post('/api/admin/run-dispatcher-now', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user || user.role !== 'admin') return errorResponse("Unauthorized", 403);

  await runDispatcher(env.DB, env.RESEND_API_KEY);
  return successResponse({ success: true });
});

adminRouter.get('/api/dashboard/stats', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  return successResponse({
    due_soon: 5,
    overdue: 2,
    emails_sent_today: 10,
    emails_failed_today: 0
  });
});
