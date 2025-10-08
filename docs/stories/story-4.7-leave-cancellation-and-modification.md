# Story 4.7: Leave Cancellation and Modification

**Epic:** 4 - Leave Management System
**Story ID:** 4.7
**Story Type:** Feature Development
**Priority:** Medium
**Estimated Effort:** 4-6 hours
**Dependencies:** Story 4.4 (Leave Approval)
**Status:** Ready for Development

---

## User Story

As a **employee**,
I want **to cancel or modify my pending or approved leave requests**,
so that **I can adjust my plans if circumstances change**.

---

## Acceptance Criteria

1. ✅ "My Leave Requests" page displays "Cancel" button for pending and approved leave requests (not for completed or denied)
2. ✅ "Cancel Request" button opens confirmation modal: "Are you sure you want to cancel this leave request?"
3. ✅ PUT /api/leave-requests/:id/cancel endpoint changes status to "Cancelled"
4. ✅ Cancelled approved leaves restore leave credits to balance
5. ✅ Cancellation notification sent to supervisor and HR admin
6. ✅ Cancellation allowed up to 1 day before leave start date (configurable)
7. ✅ Leave requests starting tomorrow or today cannot be cancelled (must contact HR admin)
8. ✅ "Modify Request" button available for pending leave requests only (not approved)
9. ✅ Modification opens pre-populated leave request form, allows changes to dates, leave type, reason
10. ✅ PUT /api/leave-requests/:id endpoint updates leave request, resets approval workflow (requires re-approval)
11. ✅ Modification notification sent to employee: "Your leave request has been updated and requires re-approval"
12. ✅ All cancellation and modification actions logged to audit log with reason and timestamp

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

- [ ] "My Leave Requests" page displays "Cancel" button for pending and approved leave requests (not for completed or denied)
- [ ] "Cancel Request" button opens confirmation modal: "Are you sure you want to cancel this leave request?"
- [ ] PUT /api/leave-requests/:id/cancel endpoint changes status to "Cancelled"
- [ ] Cancelled approved leaves restore leave credits to balance
- [ ] Cancellation notification sent to supervisor and HR admin
- [ ] Cancellation allowed up to 1 day before leave start date (configurable)
- [ ] Leave requests starting tomorrow or today cannot be cancelled (must contact HR admin)
- [ ] "Modify Request" button available for pending leave requests only (not approved)
- [ ] Modification opens pre-populated leave request form, allows changes to dates, leave type, reason
- [ ] PUT /api/leave-requests/:id endpoint updates leave request, resets approval workflow (requires re-approval)
- [ ] Modification notification sent to employee: "Your leave request has been updated and requires re-approval"
- [ ] All cancellation and modification actions logged to audit log with reason and timestamp

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
- [ ] Ready for 4.8 - Leave Monetization

---

**Next Story:** 4.8 - Leave Monetization
