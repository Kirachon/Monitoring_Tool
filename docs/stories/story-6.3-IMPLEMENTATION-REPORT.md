# Story 6.3: Leave Reports (CSC Compliance) - Implementation Report

## Overview
Provides annual leave reporting per employee (VL/SL ending balance, accrued YTD, used YTD) with CSV export.

## Backend
- Endpoints:
  - GET `/api/reports/leave` (filters: year, employeeId, departmentId)
  - GET `/api/reports/leave/export` (CSV)
- Service: `reportService.leaveReport()` aggregates from `leave_balances` and `leave_credits`
- Security: `report.read`

## Frontend
- View: `frontend/src/views/reports/LeaveReports.vue`
- Service: `reportService.leave`, `reportService.leaveExport`
- Router: `/reports/leave`

## Testing Recommendations
- Cross-check YTD accrual and usage sums vs transactions
- Edge cases: no transactions, partial year employment

## Status
✅ Completed.

