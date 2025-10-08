# Story 3.3: Pass Slip Time Tracking

**Epic:** 3 - Pass Slip Management
**Story ID:** 3.3
**Story Type:** Feature Development
**Priority:** Medium
**Estimated Effort:** 4-6 hours
**Dependencies:** Story 3.2 (Approval Workflow)
**Status:** Ready for Development

---

## User Story

As a **employee**,
I want **to record my actual return time when I come back to the office**,
so that **my pass slip record is complete and accurate**.

---

## Acceptance Criteria

1. ✅ Approved pass slips display "Record Return" button when current time >= time out
2. ✅ "Record Return" button opens modal with actual time in (time picker, default current time)
3. ✅ PUT /api/pass-slips/:id/return endpoint updates actual_time_in field
4. ✅ Actual time in must be >= time out (validation)
5. ✅ Pass slip status changes to "Completed" after return time recorded
6. ✅ Overdue pass slips (current time > expected time in + 30 minutes, no return recorded) flagged with "Overdue" badge
7. ✅ Overdue pass slips appear in supervisor's dashboard with alert icon
8. ✅ Supervisor can record return time on behalf of employee if needed
9. ✅ Return time recording logged to audit log
10. ✅ Completed pass slips display duration: actual time in - time out (in hours and minutes)
11. ✅ Pass slips with actual time in > expected time in + 1 hour highlighted for supervisor review

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

- [ ] Approved pass slips display "Record Return" button when current time >= time out
- [ ] "Record Return" button opens modal with actual time in (time picker, default current time)
- [ ] PUT /api/pass-slips/:id/return endpoint updates actual_time_in field
- [ ] Actual time in must be >= time out (validation)
- [ ] Pass slip status changes to "Completed" after return time recorded
- [ ] Overdue pass slips (current time > expected time in + 30 minutes, no return recorded) flagged with "Overdue" badge
- [ ] Overdue pass slips appear in supervisor's dashboard with alert icon
- [ ] Supervisor can record return time on behalf of employee if needed
- [ ] Return time recording logged to audit log
- [ ] Completed pass slips display duration: actual time in - time out (in hours and minutes)
- [ ] Pass slips with actual time in > expected time in + 1 hour highlighted for supervisor review

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
- [ ] Ready for 3.4 - Pass Slip History and Search

---

**Next Story:** 3.4 - Pass Slip History and Search
