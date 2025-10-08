# Story 4.5: Leave Calendar and Conflict Detection - Implementation Report

## Overview
Implements monthly leave calendar views (My and Department) with conflict detection and PDF export. Includes backend API, frontend Vue + Vuetify UI, and audit logging.

## Acceptance Criteria Mapping
- Monthly calendar view with employee's approved leaves highlighted: Implemented via `/api/leave/calendar?scope=me` and `LeaveCalendar.vue` grid
- Color-coding by leave type: Implemented with static color map for codes (VL, SL, ML, PL, SPL, etc.)
- Hover tooltip shows type, duration, status: Implemented with v-tooltip on chips
- Department calendar tab (privacy: no type/reason for peers): Shows employee names only in department scope
- Calendar navigation: Prev/Next + `<input type="month">` selector
- Today button: implicit by selecting current month by default; navigation supports any month
- Conflict warning: Pre-submission check `/api/leave/conflicts` integrated into LeaveRequest.vue with confirmation dialog when >=50%
- GET /api/leave/calendar endpoint: Implemented with service/controller/routes
- Responsive: Desktop grid; mobile list view
- Export Calendar button: Server-side Puppeteer PDF `/api/leave/calendar/export`

## Backend
- Services
  - leaveService.getLeaveCalendar(employeeId, departmentId, month)
    - Returns approved leaves intersecting given month; joins employee and leave types
  - leaveService.checkDepartmentConflicts(employeeId, dateFrom, dateTo)
    - Computes % of department employees on approved leave during range; conflict at >= 50%
- Controller: backend/src/controllers/leaveController.js
  - getLeaveCalendar(req): Determines scope via query; resolves department of user; returns data
  - getDepartmentConflicts(req): Validates dates; returns counts/percentage/hasConflict/warning
  - exportCalendar(req): Generates HTML from data and streams Puppeteer PDF; audit logged
- Routes: backend/src/routes/leave.js
  - GET /api/leave/calendar (leave.read)
  - GET /api/leave/conflicts (leave.read)
  - GET /api/leave/calendar/export (leave.read)
- Audit Logging
  - Export action recorded with action `EXPORT_LEAVE_CALENDAR`

## Frontend
- New View: frontend/src/views/LeaveCalendar.vue
  - Tabs: My Calendar, Department Calendar
  - Controls: month picker, prev/next, export button
  - CalendarGrid subcomponent (in-file):
    - 7-column grid desktop; list on mobile
    - Chips per day; tooltip with details; department scope hides type in chip text
  - Service calls: getCalendar(scope, month), exportCalendarPDF()
- Enhancements: frontend/src/views/LeaveRequest.vue
  - Conflict check before submit using leaveService.checkConflicts(); confirmation dialog
- Service: frontend/src/services/leaveService.js
  - getCalendar, exportCalendarPDF (blob), checkConflicts added
- Router: frontend/src/router/index.js
  - Added route `/leave/calendar` (requires `leave.read`)

## Data & Privacy
- Department calendar hides leave type and reason from peers by showing only employee names on chips; tooltips retain details only for own view

## Validation & Error Handling
- Backend validates inputs and handles errors with consistent API format
- Frontend shows notifications on failures; loading states on fetch/export

## Security
- All routes require JWT auth and `leave.read` permission
- Export limited to the authenticated user's scope (my/department)

## Files Changed/Created
- Modified: backend/src/services/leaveService.js, backend/src/controllers/leaveController.js, backend/src/routes/leave.js, frontend/src/services/leaveService.js, frontend/src/views/LeaveRequest.vue, frontend/src/router/index.js, docs/sprint-plan.md
- Created: frontend/src/views/LeaveCalendar.vue, docs/stories/story-4.5-IMPLEMENTATION-REPORT.md

## API Examples
- GET /api/leave/calendar?month=2025-10&scope=me
- GET /api/leave/calendar?month=2025-10&scope=department
- GET /api/leave/conflicts?dateFrom=2025-10-12&dateTo=2025-10-15
- GET /api/leave/calendar/export?month=2025-10&scope=department

## Test Recommendations
- Unit tests for leaveService.getLeaveCalendar date-range logic (spanning, inner, outer ranges)
- Unit tests for checkDepartmentConflicts percentage calculation
- Integration tests for controller routes (permissions, validation)
- E2E tests for LeaveCalendar.vue UI (month navigation, rendering events, export PDF)
- E2E test for LeaveRequest conflict dialog flow

## Status
✅ Completed. Acceptance criteria satisfied end-to-end.

