# E2E Testing Blockers - Navigation and Permission Issues

## Executive Summary

**Critical Issue Identified**: There is a **permission name mismatch** between the database seed file and the Vue Router configuration, preventing users from accessing key features even when they have the correct roles assigned.

**Impact**: E2E tests cannot navigate to Pass Slip, Leave Management, and Certificate features, blocking comprehensive test execution.

**Root Cause**: Inconsistent permission naming conventions between backend (database) and frontend (router).

---

## Detailed Analysis

### 1. Permission Name Mismatches

The following mismatches exist between seeded permissions and router requirements:

| Feature | Router Expects | Database Has | Status |
|---------|---------------|--------------|--------|
| Pass Slips - List | `passslip.read` | `pass_slip.read_own`, `pass_slip.read_all` | ❌ MISMATCH |
| Pass Slips - Create | `passslip.create` | `pass_slip.create` | ❌ MISMATCH |
| Pass Slips - Approve | `passslip.approve` | `pass_slip.approve` | ❌ MISMATCH |
| Leave - List | `leave.read` | `leave.read_own`, `leave.read_all` | ❌ MISMATCH |
| Leave - Create | `leave.create` | ✅ `leave.create` | ✅ MATCH |
| Leave - Approve | `leave.approve` | ✅ `leave.approve` | ✅ MATCH |
| Leave - Manage | `leave.manage` | `leave.configure` | ❌ MISMATCH |
| Certificates - Generate | `certificate.generate` | ✅ `certificate.generate` | ✅ MATCH |
| Certificates - Templates | `certificate.write` | `certificate.manage_templates` | ❌ MISMATCH |
| Certificates - Log | `certificate.read` | None | ❌ MISSING |
| Employees | `employee.read` | `employee.read_own`, `employee.read_all` | ❌ MISMATCH |
| Departments | `employee.read` | `department.read` | ❌ WRONG PERMISSION |
| Reports | `report.read` | `reports.view` | ❌ MISMATCH |
| Audit Logs | `audit.read` | `system.audit_log` | ❌ MISMATCH |

### 2. Router Configuration Issues

**File**: `frontend/src/router/index.js`

**Problem Areas**:

```javascript
// Line 27: Users page requires 'system.admin' - ✅ CORRECT
meta: { requiresAuth: true, requiresPermission: 'system.admin' }

// Line 39: Departments requires 'employee.read' - ❌ WRONG (should be 'department.read')
meta: { requiresAuth: true, requiresPermission: 'employee.read' }

// Line 57: Pass Slips List requires 'passslip.read' - ❌ MISMATCH (DB has 'pass_slip.read_own/all')
meta: { requiresAuth: true, requiresPermission: 'passslip.read' }

// Line 63: Pass Slip Request requires 'passslip.create' - ❌ MISMATCH (DB has 'pass_slip.create')
meta: { requiresAuth: true, requiresPermission: 'passslip.create' }
```

### 3. Database Permissions (Seeded)

**File**: `backend/seeds/001_roles_permissions.js`

**Actual Permission Names**:
- `pass_slip.create`, `pass_slip.read_own`, `pass_slip.read_all`, `pass_slip.approve`, `pass_slip.cancel`
- `leave.create`, `leave.read_own`, `leave.read_all`, `leave.approve`, `leave.cancel`, `leave.configure`
- `employee.read_own`, `employee.read_all`, `employee.write`, `employee.delete`
- `certificate.request`, `certificate.generate`, `certificate.manage_templates`
- `department.read`, `department.write`
- `reports.view`, `reports.export`
- `user.read`, `user.write`, `user.delete`, `user.assign_roles`
- `system.config`, `system.audit_log`, `system.admin`

### 4. Test User Permissions

Based on the seed file, test users have these permissions:

**Employee** (role_id: 1):
- `pass_slip.create`, `pass_slip.read_own`
- `leave.create`, `leave.read_own`
- `employee.read_own`
- `certificate.request`
- `department.read`

**Supervisor** (role_id: 2):
- All Employee permissions PLUS:
- `pass_slip.read_all`, `pass_slip.approve`
- `leave.read_all`, `leave.approve`
- `employee.read_all`
- `reports.view`

**HR Administrator** (role_id: 3):
- All Supervisor permissions PLUS:
- `pass_slip.cancel`
- `leave.cancel`, `leave.configure`
- `employee.write`
- `certificate.generate`, `certificate.manage_templates`
- `department.write`
- `reports.export`

**System Administrator** (role_id: 4):
- All permissions including:
- `employee.delete`
- `user.read`, `user.write`, `user.delete`, `user.assign_roles`
- `system.config`, `system.audit_log`, `system.admin`

---

## Solutions

### Option 1: Fix Router Configuration (RECOMMENDED)

Update `frontend/src/router/index.js` to match the database permission names:

```javascript
// Pass Slips
{ path: '/pass-slips', meta: { requiresPermission: 'pass_slip.read_own' } }
{ path: '/pass-slips/request', meta: { requiresPermission: 'pass_slip.create' } }
{ path: '/pass-slips/approvals', meta: { requiresPermission: 'pass_slip.approve' } }

// Leave
{ path: '/leave/requests', meta: { requiresPermission: 'leave.read_own' } }
{ path: '/leave/request', meta: { requiresPermission: 'leave.create' } }
{ path: '/leave/balance', meta: { requiresPermission: 'leave.read_own' } }
{ path: '/leave/approvals', meta: { requiresPermission: 'leave.approve' } }
{ path: '/leave/calendar', meta: { requiresPermission: 'leave.read_own' } }
{ path: '/leave/monetization', meta: { requiresPermission: 'leave.configure' } }

// Certificates
{ path: '/certificates/templates', meta: { requiresPermission: 'certificate.manage_templates' } }
{ path: '/certificates/generate', meta: { requiresPermission: 'certificate.generate' } }
{ path: '/certificates/batch', meta: { requiresPermission: 'certificate.generate' } }
{ path: '/signatures', meta: { requiresPermission: 'certificate.manage_templates' } }
{ path: '/certificates/log', meta: { requiresPermission: 'certificate.generate' } } // Or add new permission

// Departments
{ path: '/departments', meta: { requiresPermission: 'department.read' } }

// Employees
{ path: '/employees', meta: { requiresPermission: 'employee.read_all' } }

// Reports
{ path: '/reports/pass-slips', meta: { requiresPermission: 'reports.view' } }
{ path: '/reports/leave', meta: { requiresPermission: 'reports.view' } }
{ path: '/reports/certificates', meta: { requiresPermission: 'reports.view' } }
{ path: '/reports/audit-logs', meta: { requiresPermission: 'system.audit_log' } }
{ path: '/reports/employees', meta: { requiresPermission: 'reports.view' } }
```

### Option 2: Update Database Permissions

Update `backend/seeds/001_roles_permissions.js` to match router expectations (NOT RECOMMENDED - more work).

### Option 3: Implement Permission Aliases

Create a permission mapping system that translates between naming conventions (COMPLEX - not recommended).

---

## Immediate Actions Required

1. **Fix Router Configuration** - Update all `requiresPermission` values in `frontend/src/router/index.js` to match database permission names
2. **Test Navigation** - Verify all test users can access their authorized features
3. **Update E2E Tests** - Ensure page object URLs match the corrected routes
4. **Document Permission Matrix** - Create a clear mapping of roles to accessible features

---

## Testing Verification Steps

After fixing the router configuration:

1. Login as **employee** (employee/Employee123!)
   - ✅ Should access: Dashboard, Pass Slips (own), Leave (own), Change Password
   - ❌ Should NOT access: User Management, Employee Management, Approvals, Reports

2. Login as **supervisor** (supervisor/Supervisor123!)
   - ✅ Should access: All Employee features + Pass Slip Approvals, Leave Approvals, Reports
   - ❌ Should NOT access: User Management, Employee Management (write), Certificate Generation

3. Login as **hradmin** (hradmin/HRAdmin123!)
   - ✅ Should access: All Supervisor features + Employee Management, Certificate Generation, Department Management
   - ❌ Should NOT access: User Management, System Configuration

4. Login as **admin** (admin/Admin123!)
   - ✅ Should access: ALL features including User Management

---

## Impact on E2E Tests

**Current Status**: Tests are failing because navigation guards block access to features.

**After Fix**: Tests should be able to:
- Navigate to all feature pages based on user role
- Interact with forms and data tables
- Test approval workflows
- Verify role-based access control

---

## Additional Findings

### Missing Vue Components

Some routes reference components that may not exist or may be stubs. Verify these exist:
- `frontend/src/views/PassSlipList.vue`
- `frontend/src/views/PassSlipRequest.vue`
- `frontend/src/views/PassSlipApprovals.vue`
- `frontend/src/views/LeaveList.vue`
- `frontend/src/views/LeaveRequest.vue`
- `frontend/src/views/LeaveBalance.vue`
- `frontend/src/views/LeaveApprovals.vue`
- `frontend/src/views/LeaveCalendar.vue`
- `frontend/src/views/LeaveMonetization.vue`
- All certificate and report views

### Navigation Menu

Check `frontend/src/components/NavigationDrawer.vue` or similar to ensure menu items:
1. Are visible based on user permissions
2. Link to the correct routes
3. Display appropriate icons and labels

---

## Conclusion

The primary blocker for E2E testing is the **permission name mismatch** between the database and router configuration. Fixing the router configuration to use the correct permission names from the database will immediately unblock E2E test execution.

**Estimated Fix Time**: 15-30 minutes
**Priority**: CRITICAL
**Complexity**: LOW

