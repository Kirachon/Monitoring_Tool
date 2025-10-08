# Story 4.7: Leave Cancellation and Modification - Implementation Report

## Overview
Enables employees to cancel pending/approved leave requests within a configurable cutoff window and modify pending requests. Approved cancellations restore leave credits automatically and are recorded as transactions.

## Backend
- Endpoints added (routes/permissions):
  - PUT `/api/leave/requests/:id/cancel` (permission: `leave.create`)
  - PUT `/api/leave/requests/:id` (permission: `leave.create`)
  - GET `/api/leave/requests/:id` (permission: `leave.read`)
- Controller: `leaveController.cancelLeaveRequest`, `leaveController.updateLeaveRequest`, `leaveController.getLeaveRequestById`
- Service:
  - `leaveService.cancelLeaveRequest(id, userId, ip, ua, reason)`
    - Validates cutoff (env: `LEAVE_CANCELLATION_CUTOFF_DAYS`, default 1 day)
    - Restores credits for previously Approved requests and inserts `leave_credits` record with `transaction_type='Leave Cancelled'`
    - Sets status to `Cancelled` and audit logs
  - `leaveService.updateLeaveRequest(id, changes, userId, ip, ua)`
    - Pending-only modification: updates fields, recomputes days, validates balance, resets approvals to Pending, audit logs
  - `leaveService.getLeaveRequestById(id)` for pre-populating forms
- Security: Ownership enforced for GET by ID (or `leave.manage`)

## Frontend
- LeaveList.vue: Added Actions column with Modify (pending) and Cancel (pending/approved) + confirmation dialog
- LeaveRequest.vue:
  - Supports edit mode via `?id=<requestId>`
  - Loads request data, pre-fills form
  - Submit dispatches to Create or Update accordingly
- Service additions: `cancelLeaveRequest`, `updateLeaveRequest`, `getLeaveRequestById`

## Audit & Logging
- All actions write audit logs with previous status and reason (when applicable)

## Testing Recommendations
- Unit: cutoff logic; credit restoration; modification validation
- Integration: update then re-approval path; cancellation of approved/pending; forbidden access to others' requests
- UI/E2E: buttons visibility per status; confirmation flow; edit mode pre-fill

## Status
✅ Completed. Acceptance criteria satisfied.
