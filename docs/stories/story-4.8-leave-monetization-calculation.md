# Story 4.8: Leave Monetization Calculation

**Epic:** 4 - Leave Management System
**Story ID:** 4.8
**Story Type:** Feature Development
**Priority:** Medium
**Estimated Effort:** 6-8 hours
**Dependencies:** Story 4.6 (Leave Balance)
**Status:** Ready for Development

---

## User Story

As a **HR administrator**,
I want **to calculate leave monetization for retiring employees per CSC rules**,
so that **I can accurately compute terminal leave pay**.

---

## Acceptance Criteria

1. ✅ "Leave Monetization" page under HR admin menu displays employee search
2. ✅ Search by employee ID or name, select employee, displays current leave balances
3. ✅ "Calculate Monetization" button opens form with fields: retirement date (date picker), daily rate (auto-populated from salary grade, editable)
4. ✅ Monetization calculation: monetizable_amount = (VL_balance + SL_balance) * daily_rate
5. ✅ CSC rules applied: maximum 300 days monetizable, unused SPL/other leaves not monetizable
6. ✅ Calculation preview displays: VL balance, SL balance, total monetizable days, daily rate, total amount
7. ✅ "Generate Report" button creates PDF report with: employee details, leave balances, calculation breakdown, total amount, authorized signatory
8. ✅ POST /api/leave-monetization endpoint saves calculation record with employee_id, retirement_date, vl_balance, sl_balance, daily_rate, total_amount, generated_by
9. ✅ Monetization report includes disclaimer: "Subject to final verification and approval by Civil Service Commission"
10. ✅ Monetization calculation logged to audit log
11. ✅ Historical monetization records viewable in "Monetization History" tab
12. ✅ "Export to Excel" button downloads monetization calculation for payroll processing

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

- [ ] "Leave Monetization" page under HR admin menu displays employee search
- [ ] Search by employee ID or name, select employee, displays current leave balances
- [ ] "Calculate Monetization" button opens form with fields: retirement date (date picker), daily rate (auto-populated from salary grade, editable)
- [ ] Monetization calculation: monetizable_amount = (VL_balance + SL_balance) * daily_rate
- [ ] CSC rules applied: maximum 300 days monetizable, unused SPL/other leaves not monetizable
- [ ] Calculation preview displays: VL balance, SL balance, total monetizable days, daily rate, total amount
- [ ] "Generate Report" button creates PDF report with: employee details, leave balances, calculation breakdown, total amount, authorized signatory
- [ ] POST /api/leave-monetization endpoint saves calculation record with employee_id, retirement_date, vl_balance, sl_balance, daily_rate, total_amount, generated_by
- [ ] Monetization report includes disclaimer: "Subject to final verification and approval by Civil Service Commission"
- [ ] Monetization calculation logged to audit log
- [ ] Historical monetization records viewable in "Monetization History" tab
- [ ] "Export to Excel" button downloads monetization calculation for payroll processing

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
- [ ] Ready for 5.1 - Certificate Template Management

---

**Next Story:** 5.1 - Certificate Template Management
