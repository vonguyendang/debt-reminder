import type { Env } from './types/env';
import { handleHealth } from './routes/health';
import { Router } from './lib/router';
import { runScheduler, runDispatcher } from '@debt-reminder/core';

import { authRouter } from './routes/auth';
import { customersRouter } from './routes/customers';
import { receivablesRouter } from './routes/receivables';
import { rulesRouter } from './routes/rules';
import { templatesRouter } from './routes/templates';
import { adminRouter } from './routes/admin';
import { jobsRouter } from './routes/jobs';
import { logsRouter } from './routes/logs';

const app = new Router();

app.get('/health', handleHealth);
app.mount(authRouter);
app.mount(customersRouter);
app.mount(receivablesRouter);
app.mount(rulesRouter);
app.mount(templatesRouter);
app.mount(adminRouter);
app.mount(jobsRouter);
app.mount(logsRouter);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.handle(request, env, ctx);
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    switch (controller.cron) {
      case "*/15 * * * *":
        ctx.waitUntil(runScheduler(env.DB));
        break;
      case "7,22,37,52 * * * *":
        ctx.waitUntil(runDispatcher(env.DB, env.RESEND_API_KEY));
        break;
      case "15 0 * * *":
        ctx.waitUntil(runMaintenance(env.DB));
        break;
      default:
        console.log(`Unhandled cron: ${controller.cron}`);
    }
  }
};

async function runMaintenance(db: any) {
  console.log("Running maintenance: clearing old logs, updating statuses");
  await db.prepare(`
    UPDATE accounts_receivable 
    SET status = 'overdue', updated_at = datetime('now') 
    WHERE status = 'pending' AND due_date < date('now')
  `).run();
}
