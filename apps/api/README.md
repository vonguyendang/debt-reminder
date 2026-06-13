# Debt Reminder API

Cloudflare Worker backend for the Debt Reminder System.

## Stack
- Cloudflare Workers
- Cloudflare D1
- TypeScript

## Local Development
1. Copy `.dev.vars.example` to `.dev.vars`
2. Run `pnpm run db:migrate`
3. Run `pnpm run dev`

## Commands
- `dev`: Start local development server
- `db:migrate`: Apply migrations to local D1
- `deploy`: Deploy to production
