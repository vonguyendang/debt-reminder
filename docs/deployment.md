# 🌐 Deployment Guide

*🌍 [Tiếng Việt](deployment.vi.md)*

This document explains how to publish your system to the real internet using **Cloudflare** for completely FREE.

The system is designed with a **Zero-Ops** mechanism, meaning once set up, you only need to write code and "Push" to GitHub. The system will **AUTOMATICALLY** deploy the latest version to the web without any manual server maintenance!

---

## Step 1: Prepare Your Accounts
You need 2 free accounts:
1. **GitHub**: To host your source code.
2. **Cloudflare**: To host and run your application.

---

## Step 2: Create a Cloudflare Database (D1)
The database stores your customers and debt records. We will create it on Cloudflare.
1. Log into Cloudflare.
2. Navigate to **Workers & Pages** > **D1**.
3. Click **Create database** and name it `debt-reminder-db`.
4. After creation, Cloudflare will provide a string called `database_id` (It looks like a random hash, e.g., `d4bxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx`).
5. Copy this `database_id` string.
6. Open the `apps/api/wrangler.jsonc` file in your code. Find the `database_id` field and paste your copied ID there.

---

## Step 3: Get Your Cloudflare API Token
To allow GitHub to command Cloudflare to automatically update the website, you must give GitHub a "Master Key".
1. On Cloudflare, click the Profile icon in the top right corner > **My Profile**.
2. Select the **API Tokens** menu on the left.
3. Click **Create Token** > Scroll to the bottom and click **Create Custom Token**.
4. Select the following Permissions:
   - Account | D1 | Edit
   - Account | Workers Scripts | Edit
   - Account | Cloudflare Pages | Edit
5. Click **Continue to summary** and then **Create Token**.
6. **COPY THIS TOKEN STRING AND SAVE IT SECURELY**, because it will only be shown once!

---

## Step 4: Push Code to GitHub
1. Create a new (empty) Repository on your GitHub account.
2. Open Terminal in your computer's project folder, and run these commands to link your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR-REPO-NAME.git
   git add .
   git commit -m "Initial upload"
   git push -u origin main
   ```

---

## Step 5: Add Keys to GitHub (Crucial Step)
For GitHub Actions to work, you must securely hide your secret keys (Secrets) inside GitHub:
1. Go to your project repository page on GitHub.
2. Go to the **Settings** tab > Scroll down the left menu to **Secrets and variables** > **Actions**.
3. Click **New repository secret** to add these 3 KEYS ONE BY ONE:

| Secret Name | Secret Value (What to paste) | Description |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | The token you copied in **Step 3** | Grants GitHub permission to upload to Cloudflare. |
| `CLOUDFLARE_ACCOUNT_ID` | Found on the bottom right of the main Cloudflare dashboard. | Your Cloudflare Account ID. |
| `API_SECRETS` | `{ "AUTH_SECRET": "Your encrypted password", "RESEND_API_KEY": "re_xxx..." }` | Type exactly this JSON format. Contains the 2 secrets you made in Local Setup. |

---

## AND YOU'RE DONE! 🚀 THE AUTOMATED MAGIC
All configuration is finished. From now on, your workflow is incredibly relaxed:

1. Whenever you edit code on your computer.
2. You run the command to push code to GitHub:
   `git add .` -> `git commit -m "Fixed abc"` -> `git push`
3. As soon as the code hits GitHub, the **GitHub Actions** "Robot" (pre-programmed in `.github/workflows/ci.yml`) wakes up!
4. This robot will AUTOMATICALLY:
   - Pull your code.
   - Install dependencies.
   - Compile the Web (Frontend).
   - Bundle the API (Backend).
   - Update the Database (D1).
   - Deploy everything to Cloudflare's global edge network.

**👉 Result:** About 2 minutes after you type `git push`, you can refresh your live website and see the new features on the Internet! Completely hands-free, true **Zero-Ops** style!
