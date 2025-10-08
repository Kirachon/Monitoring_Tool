# Story 6.1: Dashboard Analytics

**Epic:** 6 - Reporting & Analytics
**Story ID:** 6.1
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 8-10 hours
**Dependencies:** Story 1.4 (RBAC)
**Status:** Ready for Development

---

## User Story

As a **system user (all roles)**,
I want **to see role-appropriate dashboard analytics and key metrics**,
so that **I can quickly understand system status and pending actions**.

---

## Acceptance Criteria

1. ✅ Employee dashboard displays widgets: My Leave Balance (VL/SL with visual gauge), Pending Requests (count), Upcoming Leaves (next 30 days), Recent Pass Slips (last 5)
2. ✅ Supervisor dashboard displays widgets: Pending Approvals (pass slips + leave requests count), Team on Leave Today (list), Department Leave Utilization (percentage), Recent Approvals (last 10)
3. ✅ HR Admin dashboard displays widgets: System Overview (total employees, active users, pending approvals), Leave Statistics (total days taken this month, most used leave type), Certificate Requests (pending/completed), Recent Activities (last 20 system actions)
4. ✅ System Admin dashboard displays widgets: All HR Admin widgets + System Health (database size, active sessions, error count), User Activity (logins today, most active users)
5. ✅ Dashboard widgets refresh automatically every 5 minutes
6. ✅ "Refresh" button manually refreshes all widgets
7. ✅ Widget data clickable: clicking "Pending Approvals" navigates to approval queue
8. ✅ GET /api/dashboard/:role endpoint returns role-specific dashboard data
9. ✅ Dashboard responsive: widgets stack vertically on mobile, grid layout on desktop
10. ✅ Date range selector for time-based widgets (default: current month)
11. ✅ Dashboard loads in < 2 seconds with lazy loading for widget data
12. ✅ "Export Dashboard" button generates PDF snapshot of current dashboard state

---

## Technical Specifications

### API Endpoints

*Refer to Architecture Document (docs/architecture/architecture.md) Section 3 for complete API specifications*

### Database Schema

*Refer to Architecture Document (docs/architecture/architecture.md) Section 2 for database schema details*

---

## UI/UX Specifications

### Design System

*Refer to UX Specification Document (docs/ux/ux-specification.md) for:*
- Color palette and typography
- Component styling with Vuetify 3
- Responsive design guidelines
- Accessibility requirements (WCAG AA)

### Wireframes

*Refer to UX Specification Document (docs/ux/ux-specification.md) Section 4 for screen wireframes*

---

## Implementation Steps

1. **Review Requirements**
   - Read all acceptance criteria carefully
   - Review related architecture and UX specifications
   - Identify dependencies on other stories

2. **Backend Implementation**
   - Create/update database migrations if needed
   - Implement API endpoints per architecture document
   - Add validation and error handling
   - Implement business logic in service layer

3. **Frontend Implementation**
   - Create Vue components following UX specifications
   - Implement forms with Vuetify components
   - Add client-side validation
   - Integrate with backend APIs
   - Implement responsive design

4. **Testing**
   - Test all acceptance criteria
   - Test edge cases and error scenarios
   - Test on different screen sizes
   - Verify accessibility compliance

5. **Documentation**
   - Update API documentation if needed
   - Add inline code comments
   - Update user documentation

---

## Testing Checklist

- [ ] Employee dashboard displays widgets: My Leave Balance (VL/SL with visual gauge), Pending Requests (count), Upcoming Leaves (next 30 days), Recent Pass Slips (last 5)
- [ ] Supervisor dashboard displays widgets: Pending Approvals (pass slips + leave requests count), Team on Leave Today (list), Department Leave Utilization (percentage), Recent Approvals (last 10)
- [ ] HR Admin dashboard displays widgets: System Overview (total employees, active users, pending approvals), Leave Statistics (total days taken this month, most used leave type), Certificate Requests (pending/completed), Recent Activities (last 20 system actions)
- [ ] System Admin dashboard displays widgets: All HR Admin widgets + System Health (database size, active sessions, error count), User Activity (logins today, most active users)
- [ ] Dashboard widgets refresh automatically every 5 minutes
- [ ] "Refresh" button manually refreshes all widgets
- [ ] Widget data clickable: clicking "Pending Approvals" navigates to approval queue
- [ ] GET /api/dashboard/:role endpoint returns role-specific dashboard data
- [ ] Dashboard responsive: widgets stack vertically on mobile, grid layout on desktop
- [ ] Date range selector for time-based widgets (default: current month)
- [ ] Dashboard loads in < 2 seconds with lazy loading for widget data
- [ ] "Export Dashboard" button generates PDF snapshot of current dashboard state

---

## Definition of Done

- [ ] All acceptance criteria met and tested
- [ ] Code follows project coding standards
- [ ] Unit tests written and passing (if applicable)
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] Responsive design verified (desktop, tablet, mobile)
- [ ] Accessibility requirements met (WCAG AA)
- [ ] Documentation updated
- [ ] Ready for 6.2 - Pass Slip Reports

---

**Next Story:** 6.2 - Pass Slip Reports
