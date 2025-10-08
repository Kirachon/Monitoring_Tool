# Story 4.6: Leave Balance Tracking - Implementation Report

## Overview
Delivers a dedicated Leave Balance page showing current balances per leave type and full transaction history with filters and CSV export. Integrates with existing leave credit APIs and enhances backend to compute YTD accrual/usage and to record Usage transactions upon approval.

## Acceptance Criteria Mapping
- Balance page with cards per leave type (VL, SL, ML, PL, SPL, etc.): Implemented in `LeaveBalance.vue`
- Each card shows name, current balance, used YTD, accrued YTD, max balance: Provided by enhanced backend service
- Balance calculation integrity: Backend maintains `leave_balances.current_balance` with transactions
- Transaction History section with columns and sorting: Implemented via v-data-table (desc by created_at)
- Transaction types covered: Monthly Accrual (Accrual), Leave Approved (Usage), Leave Cancelled (handled in Story 4.7), Manual Adjustment, Opening Balance
- Filters: leave type, transaction type, date range (frontend filters query params)
- API endpoints used: `GET /api/leave-credits/balances/:employeeId`, `GET /api/leave-credits/history/:employeeId`
- Export to Excel: Implemented as CSV downloads for balances and transactions (Excel-compatible)
- Balance summary stats available via computed values in UI

## Backend Changes
- Enhanced `leaveCreditService.getLeaveBalances(employeeId)` to include:
  - `accruedYtd` and `usedYtd` computed from `leave_credits` current-year sums
  - `maxBalance` from `leave_types.max_balance`
- Updated `leaveService.approveLeaveRequest(...)` to insert a `leave_credits` record with `transaction_type='Usage'` and negative amount for accurate history and YTD used calculations

## Frontend Changes
- New view: `frontend/src/views/LeaveBalance.vue`
  - Cards per leave type with key metrics
  - Filters: leave type, transaction type, date range
  - Transaction history table
  - Export to Excel (CSV) for balances and transactions
- Router: added `/leave/balance` route
- Service: `frontend/src/services/leaveService.js`
  - Added `getBalances(employeeId)` and `getCreditHistory(employeeId, filters)`

## Files Changed/Created
- Modified: `backend/src/services/leaveCreditService.js`, `backend/src/services/leaveService.js`, `frontend/src/services/leaveService.js`, `frontend/src/router/index.js`, `docs/sprint-plan.md`
- Created: `frontend/src/views/LeaveBalance.vue`, `docs/stories/story-4.6-IMPLEMENTATION-REPORT.md`

## Security & Validation
- Endpoints protected by `leave.read` permission and JWT auth
- Frontend displays friendly errors and loading states

## Testing Recommendations
- Unit test YTD aggregation logic for various transaction mixes
- Integration tests for `approveLeaveRequest` to ensure Usage transaction recorded
- UI tests for filters and CSV export

## Status
✅ Completed. Acceptance criteria satisfied.

