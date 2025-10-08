# API Reference (Selected)

Auth
- POST /api/auth/login
- POST /api/auth/logout

Leave
- GET /api/leave/types
- GET /api/leave/balance
- GET /api/leave/requests[?page=&limit=]
- POST /api/leave/requests
- GET /api/leave/approvals/pending
- PUT /api/leave/requests/:id/approve
- PUT /api/leave/requests/:id/deny

Pass Slips
- GET /api/pass-slips[?page=&limit=]
- POST /api/pass-slips
- GET /api/pass-slips/approvals/pending
- PUT /api/pass-slips/:id/approve
- PUT /api/pass-slips/:id/deny

Certificates
- GET /api/certificates/templates
- POST /api/certificates/preview
- POST /api/certificates/generate

Dashboards
- GET /api/dashboard (auto by role)

Notes
- Approvals: use `approvals` table with `action` and `approval_level`, `approver_id` is users.id
- Leave: date fields `date_from`/`date_to`, days: `num_days`, half-day: `is_half_day`
- Leave balances: `current_balance` column

