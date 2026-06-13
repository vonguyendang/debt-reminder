import { JobsRepository, RulesRepository, ReceivableRepository } from '@debt-reminder/db';

export async function runScheduler(db: any) {
  console.log("Running scheduler: generating jobs for due receivables");
  const jobsRepo = new JobsRepository(db);
  const rulesRepo = new RulesRepository(db);
  const recRepo = new ReceivableRepository(db);

  // Get all pending receivables (assuming a reasonable limit for now)
  const pendingReceivables = await recRepo.list(1, 1000, 'pending');

  for (const rec of pendingReceivables) {
    const dueDate = new Date(rec.due_date);
    const assignedRules = await recRepo.getRulesForReceivable(rec.id);
    for (const rule of assignedRules) {
      const targetDate = new Date(dueDate.getTime());
      
      if (rule.trigger_type === 'before_due') {
        targetDate.setMinutes(targetDate.getMinutes() - rule.offset_minutes);
      } else if (rule.trigger_type === 'after_due') {
        targetDate.setMinutes(targetDate.getMinutes() + rule.offset_minutes);
      }

      // idempotency key: rec_id + rule_id + YYYY-MM-DD
      const dateString = targetDate.toISOString().split('T')[0];
      const idempotencyKey = `${rec.id}_${rule.id}_${dateString}`;

      const exists = await jobsRepo.checkIdempotency(idempotencyKey);
      if (!exists) {
        await jobsRepo.createJob({
          id: `job_${crypto.randomUUID()}`,
          receivable_id: rec.id,
          customer_id: rec.customer_id,
          rule_id: rule.id,
          template_id: rule.template_id,
          idempotency_key: idempotencyKey,
          scheduled_for_utc: targetDate.toISOString()
        });
        console.log(`Created job ${idempotencyKey}`);
      }
    }
  }
}
