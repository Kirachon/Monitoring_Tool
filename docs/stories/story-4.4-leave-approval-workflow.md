# Story 4.4: Leave Approval Workflow

**Epic:** 4 - Leave Management System
**Story ID:** 4.4
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 8-10 hours
**Dependencies:** Story 4.3 (Leave Request)
**Status:** Ready for Development

---

## User Story

As a **supervisor**,
I want **to review and approve/deny leave requests from my department with balance verification**,
so that **I can manage team absences while ensuring leave policy compliance**.

---

## Acceptance Criteria

1. ✅ Supervisor dashboard displays "Pending Leave Approvals" widget with count
2. ✅ "Pending Leave Requests" page lists all requests requiring approval with columns: employee name, leave type, dates, duration, reason, current balance
3. ✅ "View Details" button opens leave request detail modal showing: employee info, leave type, dates, duration, reason, attachment (if any), current balance, approval history
4. ✅ "View Attachment" button downloads medical certificate or supporting document
5. ✅ "Approve" button validates sufficient leave balance, changes status to "Approved", deducts leave credits from balance
6. ✅ "Deny" button opens comment modal requiring denial reason (minimum 10 characters)
7. ✅ PUT /api/leave-requests/:id/approve endpoint updates status, deducts credits, validates supervisor permission
8. ✅ PUT /api/leave-requests/:id/deny endpoint updates status with denial reason, no balance deduction
9. ✅ Email/in-app notification sent to employee on approval/denial
10. ✅ Multi-level approval: if workflow requires multiple approvers, status remains "Pending" for next approver
11. ✅ Final approval changes status to "Approved", credits deducted, leave appears on calendar
12. ✅ Approval/denial actions logged to audit log with approver ID, timestamp, action, comments, balance before/after
13. ✅ "Department Leave Calendar" shows approved leaves for all department employees

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

- [ ] Supervisor dashboard displays "Pending Leave Approvals" widget with count
- [ ] "Pending Leave Requests" page lists all requests requiring approval with columns: employee name, leave type, dates, duration, reason, current balance
- [ ] "View Details" button opens leave request detail modal showing: employee info, leave type, dates, duration, reason, attachment (if any), current balance, approval history
- [ ] "View Attachment" button downloads medical certificate or supporting document
- [ ] "Approve" button validates sufficient leave balance, changes status to "Approved", deducts leave credits from balance
- [ ] "Deny" button opens comment modal requiring denial reason (minimum 10 characters)
- [ ] PUT /api/leave-requests/:id/approve endpoint updates status, deducts credits, validates supervisor permission
- [ ] PUT /api/leave-requests/:id/deny endpoint updates status with denial reason, no balance deduction
- [ ] Email/in-app notification sent to employee on approval/denial
- [ ] Multi-level approval: if workflow requires multiple approvers, status remains "Pending" for next approver
- [ ] Final approval changes status to "Approved", credits deducted, leave appears on calendar
- [ ] Approval/denial actions logged to audit log with approver ID, timestamp, action, comments, balance before/after
- [ ] "Department Leave Calendar" shows approved leaves for all department employees

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
- [ ] Ready for 4.5 - Leave Calendar

---

**Next Story:** 4.5 - Leave Calendar
