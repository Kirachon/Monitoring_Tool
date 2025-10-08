# Operations Runbook

## Health
- Backend health: GET /api/health (if enabled) or check logs
- DB health: `SELECT 1;`

## Post-deploy Smoke
Run: `npx playwright test e2e-tests/tests/smoke/prod-verify.spec.js`
- Confirms 8 critical endpoints return 200/201

## Migrations
- Apply: `npm run backend:migrate`
- Rollback: `npm run backend:rollback`

## Indexes (Performance)
- Migration: 20251007120000_add_performance_indexes.js
- Contains indexes for approvals, leave_requests, pass_slips, audit_logs, users

## Logs & Metrics
- Logs: backend/src/config/logger (JSON to console)
- Audit logs: `audit_logs` table; key actions include approvals and certificate generation

## Permissions
- Enforced via middleware `requirePermission` (e.g., `leave.approve`, `leave.create`)
- Seeded roles: System Admin, HR Admin, Supervisor, Employee

## Troubleshooting
- 401/403: ensure frontend uses configured API client, check tokens
- 400 on leave approve: verify leave balances exist and schema uses `current_balance`
- Missing signatories: confirm permissions alignment with seed

