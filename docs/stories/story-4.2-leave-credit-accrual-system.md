# Story 4.2: Leave Credit Accrual System

**Epic:** 4 - Leave Management System
**Story ID:** 4.2
**Story Type:** Technical Foundation
**Priority:** Critical
**Estimated Effort:** 8-10 hours
**Dependencies:** Story 4.1 (Leave Types), Story 2.2 (Employee Management)
**Status:** Ready for Development

---

## User Story

As a **HR administrator**,
I want **leave credits to automatically accrue for all employees according to CSC rules**,
so that **leave balances are always accurate without manual calculation**.

---

## Acceptance Criteria

1. ✅ Leave credits initialized for all employees on system setup: VL 0 days, SL 0 days (new employees start with zero balance)
2. ✅ Monthly accrual job runs on 1st day of each month at 12:01 AM
3. ✅ Accrual calculation: employees with Regular status accrue 1.25 days VL and 1.25 days SL per month
4. ✅ Accrual prorated for partial months: employees hired mid-month accrue (days_employed / days_in_month) * 1.25
5. ✅ Accrual records created in leave_credits table with: employee_id, leave_type, amount, accrual_date, reason ("Monthly Accrual - [Month Year]")
6. ✅ Leave balances updated in leave_balances table: current_balance += accrued_amount
7. ✅ Maximum balance enforced: VL and SL cannot exceed 300 days (excess credits forfeited)
8. ✅ Accrual notification sent to employees: "Your leave credits have been updated. VL: X days, SL: Y days"
9. ✅ Manual accrual adjustment available to HR admin: "Adjust Leave Credits" button opens form with employee, leave type, amount (+/-), reason
10. ✅ POST /api/leave-credits/adjust endpoint creates manual adjustment record with HR admin attribution
11. ✅ All accrual and adjustment actions logged to audit log
12. ✅ "Leave Credits Report" shows accrual history per employee with running balance

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

- [ ] Leave credits initialized for all employees on system setup: VL 0 days, SL 0 days (new employees start with zero balance)
- [ ] Monthly accrual job runs on 1st day of each month at 12:01 AM
- [ ] Accrual calculation: employees with Regular status accrue 1.25 days VL and 1.25 days SL per month
- [ ] Accrual prorated for partial months: employees hired mid-month accrue (days_employed / days_in_month) * 1.25
- [ ] Accrual records created in leave_credits table with: employee_id, leave_type, amount, accrual_date, reason ("Monthly Accrual - [Month Year]")
- [ ] Leave balances updated in leave_balances table: current_balance += accrued_amount
- [ ] Maximum balance enforced: VL and SL cannot exceed 300 days (excess credits forfeited)
- [ ] Accrual notification sent to employees: "Your leave credits have been updated. VL: X days, SL: Y days"
- [ ] Manual accrual adjustment available to HR admin: "Adjust Leave Credits" button opens form with employee, leave type, amount (+/-), reason
- [ ] POST /api/leave-credits/adjust endpoint creates manual adjustment record with HR admin attribution
- [ ] All accrual and adjustment actions logged to audit log
- [ ] "Leave Credits Report" shows accrual history per employee with running balance

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
- [ ] Ready for 4.3 - Leave Request Form

---

**Next Story:** 4.3 - Leave Request Form
