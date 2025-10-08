# Developer Guide

## Prerequisites
- Node.js 18+
- npm
- PostgreSQL 14 (Docker recommended)

## Setup
1. Copy backend/.env.example to backend/.env and adjust values
2. Install deps: `npm install` in project root (installs workspaces)
3. Start DB (Docker): `docker compose up -d db`
4. Run migrations and seeds:
   - `npm run backend:migrate`
   - `npm run backend:seed`
5. Start dev servers:
   - Backend: `npm run backend:dev`
   - Frontend: `npm run frontend:dev`

## Testing
- E2E tests (Playwright): `npx playwright test`
- Headed mode: `npx playwright test --headed --project=chromium`
- Smoke endpoints: `npx playwright test e2e-tests/tests/smoke/prod-verify.spec.js`

## Users
- admin / Admin123!
- hradmin / HRAdmin123!
- supervisor / Supervisor123!
- employee / Employee123!

## Conventions
- Express + Knex; use configured `db` and `logger`
- Approvals table uses fields: `entity_type`, `entity_id`, `approver_id` (users.id), `action` ('Pending'|'Approved'|'Denied'), `approval_level`
- Leave requests use: `date_from`, `date_to`, `num_days`, `is_half_day`
- Leave balances use: `current_balance`

## Useful scripts
- `npm run prod:verify` runs cross-platform smoke via Playwright
- `npm run backend:migrate` applies DB migrations
- `npm run backend:rollback` rolls back last migration

