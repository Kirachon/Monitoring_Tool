# Story 4.1: Leave Types Configuration

**Epic:** 4 - Leave Management System
**Story ID:** 4.1
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 4-6 hours
**Dependencies:** Story 1.2 (Database Schema)
**Status:** Ready for Development

---

## User Story

As a **HR administrator**,
I want **to configure all CSC leave types with their specific rules**,
so that **the system accurately handles different leave categories according to government regulations**.

---

## Acceptance Criteria

1. ✅ "Leave Types" page under system configuration lists all leave types with columns: name, code, accrual rate, max balance, requires medical certificate, monetizable
2. ✅ System pre-populated with CSC leave types: Vacation Leave (VL), Sick Leave (SL), Maternity Leave, Paternity Leave, Special Privilege Leave (SPL), Solo Parent Leave, Study Leave
3. ✅ "Add Leave Type" button opens form with fields: leave name, leave code, accrual rate (days per month), max balance (days), requires medical certificate (checkbox), monetizable (checkbox), description
4. ✅ POST /api/leave-types endpoint creates leave type with validation: code unique, accrual rate >= 0
5. ✅ "Edit Leave Type" button allows modification of all fields except code (code immutable after creation)
6. ✅ Leave type rules: VL/SL accrue at 1.25 days/month, max balance 300 days; Maternity Leave 105 days (no accrual), Paternity Leave 7 days (no accrual), SPL 3 days/year (no accrual)
7. ✅ "Deactivate Leave Type" button soft-deletes leave type (historical records preserved)
8. ✅ Deactivated leave types not available for new requests but visible in historical data
9. ✅ Leave type configuration changes logged to audit log
10. ✅ GET /api/leave-types endpoint returns active leave types for dropdown population

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

- [ ] "Leave Types" page under system configuration lists all leave types with columns: name, code, accrual rate, max balance, requires medical certificate, monetizable
- [ ] System pre-populated with CSC leave types: Vacation Leave (VL), Sick Leave (SL), Maternity Leave, Paternity Leave, Special Privilege Leave (SPL), Solo Parent Leave, Study Leave
- [ ] "Add Leave Type" button opens form with fields: leave name, leave code, accrual rate (days per month), max balance (days), requires medical certificate (checkbox), monetizable (checkbox), description
- [ ] POST /api/leave-types endpoint creates leave type with validation: code unique, accrual rate >= 0
- [ ] "Edit Leave Type" button allows modification of all fields except code (code immutable after creation)
- [ ] Leave type rules: VL/SL accrue at 1.25 days/month, max balance 300 days; Maternity Leave 105 days (no accrual), Paternity Leave 7 days (no accrual), SPL 3 days/year (no accrual)
- [ ] "Deactivate Leave Type" button soft-deletes leave type (historical records preserved)
- [ ] Deactivated leave types not available for new requests but visible in historical data
- [ ] Leave type configuration changes logged to audit log
- [ ] GET /api/leave-types endpoint returns active leave types for dropdown population

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
- [ ] Ready for 4.2 - Leave Credit Accrual System

---

**Next Story:** 4.2 - Leave Credit Accrual System
