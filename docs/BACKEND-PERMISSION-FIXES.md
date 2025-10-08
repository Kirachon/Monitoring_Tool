# Backend Permission Fixes - Implementation Guide

**Date**: 2025-10-06  
**Status**: Ready for Implementation  
**Estimated Time**: 2-3 hours

---

## Overview

This document provides the exact changes needed to fix the permission name mismatch in backend route files.

---

## File 1: `backend/src/routes/passSlips.js`

### Changes Required: 8 permission checks

| Line | Current (WRONG) | New (CORRECT) | Reason |
|------|----------------|---------------|--------|
| 18 | `passslip.create` | `pass_slip.create` | Add underscore |
| 24 | `passslip.read` | `pass_slip.read_all` | Use read_all for admin route |
| 30 | `passslip.approve` | `pass_slip.approve` | Add underscore |
| 36 | `passslip.approve` | `pass_slip.approve` | Add underscore |
| 42 | `passslip.read` | `pass_slip.read_own` | Use read_own for user route |
| 48 | `passslip.approve` | `pass_slip.approve` | Add underscore |
| 54 | `passslip.approve` | `pass_slip.approve` | Add underscore |
| 60 | `passslip.approve` | `pass_slip.approve` | Add underscore |
| 66 | `passslip.read` | `pass_slip.read_own` | Use read_own for user route |
| 72 | `passslip.read` | `pass_slip.read_own` | Use read_own for user route |

### Implementation:

```javascript
// Line 18: Create pass slip
router.post('/', requirePermission('pass_slip.create'), passSlipController.createPassSlip);

// Line 24: Get all pass slips (HR admin)
router.get('/all', requirePermission('pass_slip.read_all'), passSlipController.getAllPassSlips);

// Line 30: Get department pass slips (Supervisor)
router.get('/department', requirePermission('pass_slip.approve'), passSlipController.getDepartmentPassSlips);

// Line 36: Get pending approvals
router.get('/approvals/pending', requirePermission('pass_slip.approve'), passSlipController.getPendingApprovals);

// Line 42: Get pass slips for current user
router.get('/', requirePermission('pass_slip.read_own'), passSlipController.getPassSlips);

// Line 48: Get overdue pass slips
router.get('/overdue', requirePermission('pass_slip.approve'), passSlipController.getOverduePassSlips);

// Line 54: Approve pass slip
router.put('/:id/approve', requirePermission('pass_slip.approve'), passSlipController.approvePassSlip);

// Line 60: Deny pass slip
router.put('/:id/deny', requirePermission('pass_slip.approve'), passSlipController.denyPassSlip);

// Line 66: Record return time
router.put('/:id/return', requirePermission('pass_slip.read_own'), passSlipController.recordReturn);

// Line 72: Get pass slip by ID
router.get('/:id', requirePermission('pass_slip.read_own'), passSlipController.getPassSlipById);
```

---

## File 2: `backend/src/routes/leave.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `leave.read` → `leave.read_own` (for user routes) or `leave.read_all` (for admin routes)
- `leave.manage` → `leave.configure`
- `leave.create` → Already correct
- `leave.approve` → Already correct
- `leave.cancel` → Already correct

---

## File 3: `backend/src/routes/users.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `user.read` → Already correct
- `user.write` → Already correct
- `user.delete` → Already correct
- `user.assign_roles` → Already correct

**Note**: Users routes might already be correct. Verify by checking the file.

---

## File 4: `backend/src/routes/employees.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `employee.read` → `employee.read_own` (for user routes) or `employee.read_all` (for admin routes)
- `employee.write` → Already correct
- `employee.delete` → Already correct

---

## File 5: `backend/src/routes/certificates.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `certificate.request` → Already correct
- `certificate.write` → `certificate.generate` (for generation routes) or `certificate.manage_templates` (for template routes)
- `certificate.read` → Check if this exists and map appropriately

---

## File 6: `backend/src/routes/reports.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `report.read` → `reports.view`
- `report.export` → `reports.export`
- `audit.read` → `system.audit_log`

---

## File 7: `backend/src/routes/departments.js`

### Expected Changes:

Check the file for these permission patterns and update:
- `employee.read` → `department.read`
- `employee.write` → `department.write`

**Additional Fix**: Investigate the 500 error in the departments controller.

---

## Database Permission Reference

For quick reference, here are ALL permissions in the database:

### Pass Slip Permissions
- `pass_slip.create` - Create pass slip requests
- `pass_slip.read_own` - View own pass slips
- `pass_slip.read_all` - View all pass slips
- `pass_slip.approve` - Approve pass slip requests
- `pass_slip.cancel` - Cancel pass slips

### Leave Permissions
- `leave.create` - Create leave requests
- `leave.read_own` - View own leave requests
- `leave.read_all` - View all leave requests
- `leave.approve` - Approve leave requests
- `leave.cancel` - Cancel leave requests
- `leave.configure` - Configure leave types and policies

### Employee Permissions
- `employee.read_own` - View own employee record
- `employee.read_all` - View all employee records
- `employee.write` - Create/update employee records
- `employee.delete` - Delete employee records

### Certificate Permissions
- `certificate.request` - Request certificates
- `certificate.generate` - Generate certificates
- `certificate.manage_templates` - Manage certificate templates

### Department Permissions
- `department.read` - View departments
- `department.write` - Create/update departments

### Report Permissions
- `reports.view` - View reports
- `reports.export` - Export reports

### User Permissions
- `user.read` - View users
- `user.write` - Create/update users
- `user.delete` - Delete users
- `user.assign_roles` - Assign roles to users

### System Permissions
- `system.config` - Configure system settings
- `system.audit_log` - View audit logs
- `system.admin` - Full system administration

---

## Testing After Fixes

### Step 1: Re-run Diagnostic Script

```bash
node test-api-endpoints.js
```

**Expected Result**: All 9 endpoints should return 200 OK (except dashboard stats which needs route verification)

### Step 2: Re-run E2E Tests

```bash
npx playwright test --headed --workers=1
```

**Expected Result**: All 32 tests should pass

### Step 3: Manual Testing

Test each feature in the browser:
1. Login as employee
2. Navigate to Pass Slips → Should load successfully
3. Navigate to Leave → Should load successfully
4. Login as admin
5. Navigate to Users → Should load successfully
6. Navigate to Employees → Should load successfully

---

## Implementation Checklist

- [ ] Fix `backend/src/routes/passSlips.js` (8 changes)
- [ ] Fix `backend/src/routes/leave.js` (verify and update)
- [ ] Fix `backend/src/routes/users.js` (verify - might be correct)
- [ ] Fix `backend/src/routes/employees.js` (verify and update)
- [ ] Fix `backend/src/routes/certificates.js` (verify and update)
- [ ] Fix `backend/src/routes/reports.js` (verify and update)
- [ ] Fix `backend/src/routes/departments.js` (verify and update)
- [ ] Investigate departments controller 500 error
- [ ] Verify dashboard route path
- [ ] Re-run diagnostic script
- [ ] Re-run E2E tests
- [ ] Manual testing in browser

---

## Risk Assessment

**Risk Level**: **LOW**

**Reasons**:
- Changes are simple find-and-replace operations
- No logic changes required
- No database changes required
- Easy to rollback if needed

**Mitigation**:
- Test each route file individually after changes
- Keep diagnostic script running to verify fixes
- Use version control to track changes

---

## Estimated Time Breakdown

| Task | Time |
|------|------|
| Fix passSlips.js | 15 min |
| Fix leave.js | 15 min |
| Fix users.js | 10 min |
| Fix employees.js | 10 min |
| Fix certificates.js | 15 min |
| Fix reports.js | 10 min |
| Fix departments.js | 10 min |
| Fix departments controller | 30 min |
| Testing | 30 min |
| **Total** | **2-3 hours** |

---

## Success Criteria

✅ All diagnostic tests pass (9/9 endpoints return 200 OK)  
✅ All E2E tests pass (32/32 tests pass)  
✅ Manual testing confirms all features are accessible  
✅ No console errors in browser  
✅ No 403 Forbidden errors in network tab

