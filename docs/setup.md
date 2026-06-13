*Language: [English](setup.md) | [Tiếng Việt](setup.vi.md)*

**Navigation**: [Home](../README.md) | [Setup Guide](setup.md) | [User Guide](user-guide.md) | [Architecture](architecture.md) | [API Contract](api-contract.md) | [Deployment](deployment.md)

---

# 💻 Local Setup Guide

*🌍 [Tiếng Việt](setup.vi.md)*

This document is for users who want to run and test the system directly on their own computer (free, completely offline).

Follow these steps slowly and carefully!

---

## Phase 1: Preparing the Tools
You need to download two software tools if you don't already have them:
1. **Node.js (Version 20 or higher)**: The engine that runs the code.
   👉 Download link: [https://nodejs.org/](https://nodejs.org/) (Choose the LTS - Long Term Support version).
2. **pnpm**: A blazing-fast package manager.
   👉 After installing Node.js, open your `Terminal` (or `CMD` on Windows) and type:
   `npm install -g pnpm`

---

## Phase 2: Fetching the Code
Open Terminal/CMD, navigate to the folder where you want to save the project, and type:
```bash
git clone https://github.com/<your-username>/debt-reminder-system.git
cd debt-reminder-system
```
*(If you already have the code on your machine, just open Terminal inside the `debt-reminder-system` folder).*

---

## Phase 3: Configuring Secret Keys
The system needs two secret keys to operate: one to secure logins, and one to send emails.

1. Navigate into the `apps/api` folder.
2. You will see a file named `.dev.vars.example`. Copy this file and rename the duplicate to `.dev.vars`.
3. Open `.dev.vars` using any text editor (like Notepad), you will see:
   ```env
   AUTH_SECRET=your_secret_string_here
   RESEND_API_KEY=re_123456789_xxxxxxxxxxxxxxxxx
   ```
4. **AUTH_SECRET**: Delete the placeholder text and type a random, hard-to-guess string (e.g., `my_super_secret_cat_password_123`). This is used to encrypt login sessions.
5. **RESEND_API_KEY**: If you only want to view the UI and don't need to send actual emails yet, you can leave this blank or type random text. If you *do* want the system to send real emails, go to [https://resend.com](https://resend.com), create a free account, grab your API Key, and paste it here.

---

## Phase 4: The Automated Magic Setup
We have bundled database creation, fake data generation, and dependency installation into **ONE SINGLE COMMAND**.

Go back to your Terminal (ensure you are at the root `debt-reminder-system` folder), and type:
```bash
pnpm run setup:local
```
Wait for about 30 to 60 seconds. The system will handle everything automatically!

---

## Phase 5: Start the Engine
Type this command to turn on the local servers:
```bash
pnpm dev
```
You will see bright text in the Terminal displaying 2 URLs.
- Everything is complete! Open your web browser (e.g., Google Chrome) and go to: **[http://localhost:5173](http://localhost:5173)**
- Log in using: `admin@example.com` / `admin123`.

*(To stop the server, go back to the Terminal and press `Ctrl + C`)*.
