# Story 4.3: Leave Request Form

**Epic:** 4 - Leave Management System
**Story ID:** 4.3
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 8-10 hours
**Dependencies:** Story 4.2 (Leave Accrual)
**Status:** Ready for Development

---

## User Story

As a **employee**,
I want **to submit leave requests with automatic balance checking**,
so that **I can request time off and see if I have sufficient leave credits**.

---

## Acceptance Criteria

1. ✅ "Request Leave" button on employee dashboard navigates to leave request form
2. ✅ Form displays: leave type (dropdown), date from (date picker), date to (date picker), number of days (auto-calculated), reason (textarea, optional for VL, required for SL), attachment (file upload for medical certificate if required)
3. ✅ Current leave balance displayed prominently: "Your VL Balance: X days, SL Balance: Y days"
4. ✅ Date range selection auto-calculates working days (excludes weekends and Philippine holidays)
5. ✅ Half-day leave option: checkbox "Half Day", time selection (AM/PM)
6. ✅ Form validation: date from <= date to, date from >= today (or configurable advance notice period), sufficient leave balance
7. ✅ Insufficient balance displays error: "Insufficient leave credits. Required: X days, Available: Y days"
8. ✅ Conflict detection: system checks for overlapping approved leave requests, displays warning if conflict exists
9. ✅ "Submit" button sends POST /api/leave-requests request
10. ✅ Successful submission displays confirmation with leave request reference number
11. ✅ Leave request status set to "Pending", balance not deducted until approval
12. ✅ Email/in-app notification sent to first approver in workflow
13. ✅ Submitted leave request appears in employee's "My Leave Requests" list with status "Pending"
14. ✅ Leave request creation logged to audit log with all field values and attachment metadata

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

- [ ] "Request Leave" button on employee dashboard navigates to leave request form
- [ ] Form displays: leave type (dropdown), date from (date picker), date to (date picker), number of days (auto-calculated), reason (textarea, optional for VL, required for SL), attachment (file upload for medical certificate if required)
- [ ] Current leave balance displayed prominently: "Your VL Balance: X days, SL Balance: Y days"
- [ ] Date range selection auto-calculates working days (excludes weekends and Philippine holidays)
- [ ] Half-day leave option: checkbox "Half Day", time selection (AM/PM)
- [ ] Form validation: date from <= date to, date from >= today (or configurable advance notice period), sufficient leave balance
- [ ] Insufficient balance displays error: "Insufficient leave credits. Required: X days, Available: Y days"
- [ ] Conflict detection: system checks for overlapping approved leave requests, displays warning if conflict exists
- [ ] "Submit" button sends POST /api/leave-requests request
- [ ] Successful submission displays confirmation with leave request reference number
- [ ] Leave request status set to "Pending", balance not deducted until approval
- [ ] Email/in-app notification sent to first approver in workflow
- [ ] Submitted leave request appears in employee's "My Leave Requests" list with status "Pending"
- [ ] Leave request creation logged to audit log with all field values and attachment metadata

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
- [ ] Ready for 4.4 - Leave Approval Workflow

---

**Next Story:** 4.4 - Leave Approval Workflow
