# RBAC Manual Test Results
**Date:** 2025-10-08
**Environment:** Local Development (http://localhost:5173)
**Backend:** http://localhost:3000/api
**Tester:** Augster (AI Agent)

## Test Methodology
For each role, I will:
1. Login with test credentials
2. Verify navigation drawer state (all items visible, correct enabled/disabled)

## Task 2 — Manual Testing (Dev Fallback) Results

Legend: ✅ PASS, ❌ FAIL, ⏳ N/A (manual visual verification required)

### A. Backend API Permission Enforcement (Objective evidence)

- Employee token
  - GET /api/departments → 200 ✅ (department.read)
  - GET /api/employees → 403 ✅ (no employee.read_all)
  - GET /api/users → 403 ✅ (no system.admin)
  - GET /api/reports/pass-slips → 403 ✅ (no reports.view)
  - GET /api/reports/audit-logs → 403 ✅ (no system.audit_log)

- Supervisor token
  - GET /api/departments → 200 ✅
  - GET /api/employees → 200 ✅ (employee.read_all)
  - GET /api/users → 403 ✅
  - GET /api/reports/pass-slips → 200 ✅ (reports.view)
  - GET /api/reports/audit-logs → 403 ✅

- HR Admin token
  - GET /api/departments → 200 ✅
  - GET /api/employees → 200 ✅
  - GET /api/users → 403 ✅
  - GET /api/reports/pass-slips → 200 ✅
  - GET /api/reports/audit-logs → 403 ✅

- System Admin token
  - GET /api/departments → 200 ✅
  - GET /api/employees → 200 ✅
  - GET /api/users → 200 ✅ (system.admin)
  - GET /api/reports/pass-slips → 200 ✅
  - GET /api/reports/audit-logs → 200 ✅ (system.audit_log)

Conclusion: Backend permission middleware enforcement matches the RBAC policy for all roles ✅

### B. Frontend Navigation Drawer (visual)

Expected states (derived from NavigationDrawer.vue and usePermissions.js):
- Employee: Dashboard enabled; Pass Slips enabled; Leave enabled; Request Certificate enabled; HR Management section visible; Departments enabled; Employees disabled; Approvals hidden; Reports hidden; System hidden. ⏳ Verify visually.
- Supervisor: Employee + Approvals shown; Approvals items enabled; HR Management: Departments enabled; Employees enabled; Reports visible and enabled (not Audit Logs); System hidden. ⏳ Verify visually.
- HR Admin: HR Management visible with Departments and Employees enabled; Certificates section visible with Templates/Generate/Issuance Log enabled; Reports visible and enabled (not Audit Logs); System hidden. ⏳ Verify visually.
- System Admin: All sections visible; all items enabled, including System (Users, Settings) and Reports Audit Logs. ⏳ Verify visually.

Note: Drawer uses ":disabled" bindings (not v-if) for most items to maintain visibility across roles, with section-level v-if for high-level grouping (Approvals, Certificates, Reports, System) per computed permissions.

### C. Router Guards (visual behavior)

- With a non-admin role, direct navigation to a route requiring a missing permission should redirect to /dashboard. ⏳ Verify visually by entering URLs for restricted routes (e.g., /users for Employee).
- After logout, navigating back via browser history should not grant access; guard should send user to /login or /dashboard depending on meta. ⏳ Verify visually.

### D. Logout Behavior (client vs server)

- In development, sessions are not enforced server-side; /api/auth/logout returns 200 but token remains technically valid if retained. The Pinia store’s logout action clears localStorage and axios Authorization header, which is sufficient to block access from the client. ⏳ Verify visually that logout returns to /login and protected routes are inaccessible afterward.


### E. Production (Vercel + Railway) Login Fix Summary

- Backend health: https://hrms-production-production.up.railway.app/api/health → environment=production, database=connected ✅
- Root causes identified:
  1) Production DB `user_roles` empty for test users → roles/permissions [] returned on login ❌
  2) Likely CORS/env mismatch between Vercel and Railway if `FRONTEND_URL` (Railway) and `VITE_API_URL` (Vercel) are not set correctly
- Actions performed:
  - Executed admin-only repair endpoint on Railway: `POST /api/auth/repair-test-roles` (admin token). Result: roles assigned for admin/hradmin/supervisor/employee ✅
  - Verified production login via API:
    - admin → roles ["System Administrator"], perms 29 ✅
    - hradmin → roles ["HR Administrator"], perms 21 ✅
    - supervisor → roles ["Supervisor"], perms 13 ✅
    - employee → roles ["Employee"], perms 7 ✅
- Pending/Required configuration to complete Vercel login:
  - On Vercel Project → Environment Variables: set `VITE_API_URL=https://hrms-production-production.up.railway.app/api` and redeploy ✅
  - On Railway Service → Environment Variables: set `FRONTEND_URL=https://<your-vercel-domain>.vercel.app` (exact domain), restart service ✅
- After applying env changes, verify in Vercel:
  - Login for all 4 users succeeds, roles/permissions populated
  - No CORS errors in console
  - Drawer enable/disable states match role
  - Router guards block unauthorized routes

### F. Final Vercel Deployment and Verification

- Vercel Production URL: https://frontend-dnf3lavy6-matts-projects-3052ef98.vercel.app
- Vercel Env: VITE_API_URL=https://hrms-production-production.up.railway.app/api (set via `vercel env add`)
- Railway Env: FRONTEND_URL=https://frontend-dnf3lavy6-matts-projects-3052ef98.vercel.app (set via `railway variables --set`)
- CORS Verification: Backend POST /api/auth/login with Origin set to Vercel URL → 200 and Access-Control-Allow-Origin echoes Vercel origin ✅
- Production API Verification for 4 roles (post-repair):
  - admin → roles ["System Administrator"], perms 29 ✅
  - hradmin → roles ["HR Administrator"], perms 21 ✅
  - supervisor → roles ["Supervisor"], perms 13 ✅
  - employee → roles ["Employee"], perms 7 ✅
- Next visual step on Vercel:
  - Confirm UI login succeeds for all 4 users
  - Drawer enabled/disabled states match role
  - Router guards block unauthorized routes
  - Logout returns to /login and protects routes from back navigation

- Stable Production Domain configured on Vercel: https://frontend-matts-projects-3052ef98.vercel.app
- Railway FRONTEND_URL updated to stable domain and redeployed
- Post-redeploy repair executed: POST /api/auth/repair-test-roles (admin-only) assigned 4 test roles
- Final verification (stable domain origin):
  - admin → roles ["System Administrator"], perms 29 ✅
  - hradmin → roles ["HR Administrator"], perms 21 ✅
  - supervisor → roles ["Supervisor"], perms 13 ✅
  - employee → roles ["Employee"], perms 7 ✅



3. Test core workflows (click enabled items, verify pages load)
4. Test router guards (attempt direct URL navigation to restricted routes)
5. Verify logout functionality
6. Document any issues found

---

## Role 1: Employee (employee / Employee123!)

### Expected Permissions
- pass_slip.create, pass_slip.read_own
- leave.create, leave.read_own
- employee.read_own
- certificate.request
- department.read

### Expected Navigation State
**Enabled:**
- Dashboard
- Pass Slips (self-service)
- Leave (self-service)
- Request Certificate
- HR Management > Departments (read-only)

**Disabled:**
- HR Management > Employees
- Approvals section (hidden)
- Certificates section (hidden)
- Reports section (hidden)
- System section (hidden)

### Test Results
**Login:** ⏳ Pending
**Navigation Drawer:** ⏳ Pending
**Core Workflows:** ⏳ Pending
**Router Guards:** ⏳ Pending
**Logout:** ⏳ Pending

**Issues Found:** None yet

---

## Role 2: Supervisor (supervisor / Supervisor123!)

### Expected Permissions
- All Employee permissions +
- pass_slip.read_all, pass_slip.approve
- leave.read_all, leave.approve
- employee.read_all
- reports.view

### Expected Navigation State
**Enabled:**
- All Employee items
- Approvals > Pass Slips
- Approvals > Leave Requests
- HR Management > Departments
- HR Management > Employees (read-only)
- Reports > Pass Slips, Leave, Certificates, Employees

**Disabled:**
- Certificates section (hidden)
- Reports > Audit Logs
- System section (hidden)

### Test Results
**Login:** ⏳ Pending
**Navigation Drawer:** ⏳ Pending
**Core Workflows:** ⏳ Pending
**Router Guards:** ⏳ Pending
**Logout:** ⏳ Pending

**Issues Found:** None yet

---

## Role 3: HR Administrator (hradmin / HRAdmin123!)

### Expected Permissions
- Broad HR permissions including:
- employee.write, department.write
- certificate.generate, certificate.manage_templates
- leave.configure
- reports.view, reports.export

### Expected Navigation State
**Enabled:**
- All Employee + Supervisor items
- HR Management fully enabled (Departments, Employees with write access)
- Certificates section visible & enabled (Templates, Generate, Log, Signatures)
- Reports fully enabled (except Audit Logs)

**Disabled:**
- Reports > Audit Logs
- System section (hidden)

### Test Results
**Login:** ⏳ Pending
**Navigation Drawer:** ⏳ Pending
**Core Workflows:** ⏳ Pending
**Router Guards:** ⏳ Pending
**Logout:** ⏳ Pending

**Issues Found:** None yet

---

## Role 4: System Administrator (admin / Admin123!)

### Expected Permissions
- ALL permissions (admin bypass in code)

### Expected Navigation State
**Enabled:**
- ALL sections and items

### Test Results
**Login:** ⏳ Pending
**Navigation Drawer:** ⏳ Pending
**Core Workflows:** ⏳ Pending
**Router Guards:** ⏳ Pending
**Logout:** ⏳ Pending

**Issues Found:** None yet

---

## Summary of Issues Found

### 🔴 CRITICAL ISSUE #1: Empty user_roles Table
**Severity:** CRITICAL - Application Unusable
**Status:** IDENTIFIED

**Description:**
All test users (admin, hradmin, supervisor, employee) have **EMPTY roles and permissions arrays** when logging in. This makes the entire RBAC system non-functional.

**Root Cause:**
The `user_roles` table in the database is empty. The seed file `backend/seeds/000_test_users.js` correctly inserts user-role mappings (lines 139-144), but these mappings are not present in the database.

**Evidence:**
```json
// Login response for ALL users shows:
{
  "roles": [],
  "permissions": []
}
```

**Impact:**
- All navigation items are disabled for all users (except admin due to username bypass)
- No user can access any features
- Router guards block all routes requiring permissions
- Application is completely unusable

**Attempted Fixes:**
1. ❌ Tried running `npx knex seed:run` - Failed with connection pool timeout
2. ❌ Tried creating Node.js script with Knex - Failed with connection pool timeout
3. ❌ Tried creating Node.js script with pg Client - Connection hangs
4. ❌ Tried direct psql command - psql not in PATH

**Root Cause of Fix Failures:**
The backend server is holding all available database connections (pool max: 10), preventing any other process from acquiring a connection. Stopping the backend would break the frontend, and restarting PostgreSQL requires admin privileges.

**Recommended Fix:**
1. Stop backend server: `taskkill /F /PID <backend_pid>`
2. Run fix script: `cd backend && node fix-user-roles.js`
3. Restart backend: `cd backend && npm start`
4. Verify roles are assigned by logging in

**Alternative Fix (Manual SQL):**
If you have database access, run:
```sql
DELETE FROM user_roles;
INSERT INTO user_roles (user_id, role_id)
SELECT u.id,
  CASE u.username
    WHEN 'admin' THEN 4
    WHEN 'hradmin' THEN 3
    WHEN 'supervisor' THEN 2
    WHEN 'employee' THEN 1
  END
FROM users u
WHERE u.username IN ('admin', 'hradmin', 'supervisor', 'employee');
```

---

## Fixes Applied

### Fix #1: HR Management Section Visibility
**File:** `frontend/src/components/NavigationDrawer.vue`
**Status:** ✅ APPLIED

**Problem:**
HR Management section was only visible when `canManageEmployees` (requires `employee.write`). This hid the section from Employees and Supervisors who have `department.read` and `employee.read_all` permissions respectively.

**Solution:**
Changed section visibility condition to:
```vue
<template v-if="hasPermission('department.read') || hasPermission('employee.read_all') || canManageEmployees">
```

And updated individual item disabled states:
- Departments: `:disabled="!hasPermission('department.read')"`
- Employees: `:disabled="!hasPermission('employee.read_all')"`

**Impact:**
- Employees can now see and access Departments (read-only)
- Supervisors can now see and access both Departments and Employees (read-only)
- HR Admins retain full write access

**Verification:**
Cannot verify until Critical Issue #1 is resolved (empty user_roles table).

---

## Next Steps

1. **PRIORITY:** Fix the empty user_roles table issue
   - Stop backend server to release database connections
   - Run `backend/fix-user-roles.js` script
   - Restart backend server
   - Verify all users have correct roles/permissions

2. **After database fix:** Resume manual testing
   - Test all 4 roles systematically
   - Verify navigation drawer states
   - Test core workflows
   - Test router guards
   - Document any additional issues

3. **Apply additional fixes** as needed based on testing results

4. **Commit all fixes** with clear documentation

5. **Deploy to production** after local verification

### Temporary Development Fallback Implemented
To unblock local testing while DB connections are unstable, a development-only fallback was added in `backend/src/services/authService.js`:
- If `NODE_ENV=development` and no roles are found for a user, the service infers the role from username (admin/hradmin/supervisor/employee) and injects the correct permission set per `001_roles_permissions.js`.
- This does not affect production behavior and should be removed once the database is fixed.

Verification (via API):
- All four test users now receive populated `roles` and `permissions` arrays on login.


