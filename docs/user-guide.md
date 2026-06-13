*Language: [English](user-guide.md) | [Tiếng Việt](user-guide.vi.md)*

**Navigation**: [Home](../README.md) | [Setup Guide](setup.md) | [User Guide](user-guide.md) | [Architecture](architecture.md) | [API Contract](api-contract.md) | [Deployment](deployment.md)

---

# 📖 User Guide

*🌍 [Tiếng Việt](user-guide.vi.md)*

This document will guide you on how to use the system from a manager's perspective, requiring absolutely no programming knowledge.

---

## 1. Logging into the System
1. Open your web browser (Chrome, Safari, Edge, etc.).
2. Navigate to the system link (e.g., `http://localhost:5173` if running locally, or your deployed website URL).
3. At the login screen, enter:
   - **Email**: Your email (Default for testing: `admin@example.com`)
   - **Password**: Your password (Default for testing: `admin123`)
4. Click the **Sign In** button.

---

## 2. Navigating the Dashboard
As soon as you log in, you'll see the Dashboard. This is your command center:
- **Upcoming Dues**: Shows the number of debts approaching their due date.
- **Overdue**: Shows debts that are PAST DUE (requiring urgent attention).
- **Emails Sent**: The number of automated reminder emails dispatched today.

---

## 3. Managing Customers
Before recording a debt, you must create a customer profile.
1. On the left menu, click **Customers**.
2. Click the blue **+ Add Customer** button in the top right corner.
3. A form will appear. Fill in the following:
   - **Full Name**: (Required) e.g., *John Doe*.
   - **Company Name**: (Optional).
   - **Email**: MUST BE ACCURATE. The system will send automated reminders to this email.
   - **Phone**: Phone number.
4. Click **Save Customer**. The new customer will appear in the list!

---

## 4. Writing Email Templates
You don't need to manually type an email every time. You can save unlimited email "scripts".
1. On the left menu, click **Templates**.
2. Click **+ Add Template**.
3. Fill in the fields:
   - **Template Name**: A recognizable name (e.g., *Friendly 3-Day Reminder*).
   - **Email Subject**: The subject line the customer will see.
   - **Email Body**: The content of the email.
4. Click **Save Template**.

---

## 5. Setting up Automated Rules
The system won't know when to send which email template unless you define Rules.
1. On the left menu, click **Rules**.
2. Click **+ Add Rule**.
3. Fill in the fields:
   - **Rule Name**: e.g., *3 Days Before Due*.
   - **Description**: Optional description for your reference.
   - **Trigger Days**: The timeframe relative to the due date. **Example: Entering "3" means "Send an email exactly 3 days before the due date"**.
   - **Template**: Click the dropdown and select the Email Template you created in Step 4.
4. Click **Save Rule**.
From now on, whenever any debt is exactly 3 days away from its due date, the system will automatically pull that email template and send it!

---

## 6. Recording a Receivable (Debt)
This is the most important step.
1. Click **Receivables** on the left menu.
2. Click **+ Add Receivable**.
3. Fill in the details:
   - **Customer**: Select the customer who owes money (created in Step 3).
   - **Amount**: The amount owed (e.g., 1000).
   - **Currency**: USD, VND, or EUR.
   - **Due Date**: Click the calendar icon and select the date they promised to pay.
4. Click **Save Receivable**.

**AND YOU'RE DONE! 🎉**
You can close your laptop and go to sleep. The system will count down to the `Due Date`. When the time aligns with your `Rules` (e.g., 3 days prior), the invisible Cloudflare "brain" will wake up, draft the email based on the `Template`, and deliver it straight to the customer's inbox! You don't need to lift a finger.
