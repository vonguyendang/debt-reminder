import { JobsRepository, CustomerRepository, ReceivableRepository, TemplatesRepository } from '@debt-reminder/db';
import { ResendProvider } from '@debt-reminder/email';

export async function runDispatcher(db: any, resendApiKey: string) {
  console.log("Running dispatcher: sending queued emails");
  const jobsRepo = new JobsRepository(db);
  const custRepo = new CustomerRepository(db);
  const recRepo = new ReceivableRepository(db);
  const tplRepo = new TemplatesRepository(db);
  
  const provider = new ResendProvider(resendApiKey, "hello@example.com"); // Ideally read from system_settings
  
  const jobs = await jobsRepo.getPendingJobsForDispatch(20);
  for (const job of jobs) {
    await jobsRepo.markJobProcessing(job.id);
    
    const customer = await custRepo.findById(job.customer_id);
    const rec = await recRepo.findById(job.receivable_id);
    
    if (!customer || customer.status === 'inactive' || !customer.email) {
      await jobsRepo.markJobFailed(job.id, "Customer invalid or inactive", job.attempt_count + 1);
      continue;
    }
    
    if (!rec || rec.status !== 'pending') {
      await jobsRepo.markJobFailed(job.id, "Receivable no longer pending", job.attempt_count + 1);
      continue;
    }
    
    const template = await tplRepo.findById(job.template_id);
    if (!template) {
      await jobsRepo.markJobFailed(job.id, "Template not found", job.attempt_count + 1);
      continue;
    }

    // Format dates
    const [year, month, day] = rec.due_date.split('-');
    const formattedDueDate = `${day}/${month}/${year}`;
    const dueDay = day;
    
    // Calculate grace period (due + 3 days)
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    d.setDate(d.getDate() + 3);
    const formattedGraceDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

    // Format amounts
    const amountRaw = (rec.amount_cents / 100).toString();
    const amountFormatted = new Intl.NumberFormat('vi-VN').format(rec.amount_cents / 100) + 'đ';

    let subject = template.subject_template
      .replace(/{{customer_name}}/g, customer.full_name)
      .replace(/{{amount}}/g, amountFormatted)
      .replace(/{{amount_raw}}/g, amountRaw)
      .replace(/{{due_date}}/g, formattedDueDate)
      .replace(/{{due_day}}/g, dueDay)
      .replace(/{{grace_period_end}}/g, formattedGraceDate);

    let html = template.html_template
      .replace(/{{customer_name}}/g, customer.full_name)
      .replace(/{{amount}}/g, amountFormatted)
      .replace(/{{amount_raw}}/g, amountRaw)
      .replace(/{{due_date}}/g, formattedDueDate)
      .replace(/{{due_day}}/g, dueDay)
      .replace(/{{grace_period_end}}/g, formattedGraceDate);
    
    const { messageId, error } = await provider.send({
      to: customer.email,
      subject,
      html
    });
    
    if (error || !messageId) {
      await jobsRepo.markJobFailed(job.id, error || "Unknown error", job.attempt_count + 1);
      await jobsRepo.logEmail(`log_${crypto.randomUUID()}`, job.id, customer.email, subject, 'failed', error || "Unknown error");
    } else {
      await jobsRepo.markJobSent(job.id, "resend", messageId);
      await jobsRepo.logEmail(`log_${crypto.randomUUID()}`, job.id, customer.email, subject, 'sent');
    }
  }
}
