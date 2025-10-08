# Story 4.6: Leave Balance Tracking

**Epic:** 4 - Leave Management System
**Story ID:** 4.6
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 6-8 hours
**Dependencies:** Story 4.2 (Leave Accrual)
**Status:** Ready for Development

---

## User Story

As a **employee**,
I want **to view my current leave balances and complete transaction history**,
so that **I can track my leave credits, accruals, and usage accurately**.

---

## Acceptance Criteria

1. ✅ "Leave Balance" page displays current balances for all leave types in card layout: VL, SL, Maternity, Paternity, SPL, etc.
2. ✅ Each card shows: leave type name, current balance (days), used this year (days), accrued this year (days), max balance
3. ✅ Balance calculation: current_balance = opening_balance + accrued - used - adjustments
4. ✅ "Transaction History" section lists all leave credit transactions with columns: date, transaction type (Accrual/Usage/Adjustment), leave type, amount (+/-), balance after, remarks
5. ✅ Transaction types: "Monthly Accrual", "Leave Approved", "Leave Cancelled", "Manual Adjustment", "Opening Balance"
6. ✅ Transactions sorted by date descending (most recent first)
7. ✅ Filter by: leave type, transaction type, date range
8. ✅ GET /api/leave-balances/:employee_id endpoint returns current balances for all leave types
9. ✅ GET /api/leave-credits/:employee_id endpoint returns transaction history with pagination
10. ✅ "Export to Excel" button downloads balance and transaction history
11. ✅ Balance summary displays year-to-date statistics: total days taken, most used leave type, remaining balance

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

- [ ] "Leave Balance" page displays current balances for all leave types in card layout: VL, SL, Maternity, Paternity, SPL, etc.
- [ ] Each card shows: leave type name, current balance (days), used this year (days), accrued this year (days), max balance
- [ ] Balance calculation: current_balance = opening_balance + accrued - used - adjustments
- [ ] "Transaction History" section lists all leave credit transactions with columns: date, transaction type (Accrual/Usage/Adjustment), leave type, amount (+/-), balance after, remarks
- [ ] Transaction types: "Monthly Accrual", "Leave Approved", "Leave Cancelled", "Manual Adjustment", "Opening Balance"
- [ ] Transactions sorted by date descending (most recent first)
- [ ] Filter by: leave type, transaction type, date range
- [ ] GET /api/leave-balances/:employee_id endpoint returns current balances for all leave types
- [ ] GET /api/leave-credits/:employee_id endpoint returns transaction history with pagination
- [ ] "Export to Excel" button downloads balance and transaction history
- [ ] Balance summary displays year-to-date statistics: total days taken, most used leave type, remaining balance

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
- [ ] Ready for 4.7 - Leave Modification

---

**Next Story:** 4.7 - Leave Modification
