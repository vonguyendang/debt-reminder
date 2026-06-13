import { Router } from '../lib/router';
import { successResponse, errorResponse } from '../lib/response';
import { requireAuth } from '../lib/auth';

export const logsRouter = new Router();

logsRouter.get('/api/logs', async (req, env) => {
  const user = await requireAuth(req, env);
  if (!user) return errorResponse("Unauthorized", 401);

  const { results } = await env.DB.prepare('SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 50').all();
  return successResponse(results);
});
