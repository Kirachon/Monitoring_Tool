# Story 6.3: Leave Reports (CSC Compliance)

**Epic:** 6 - Reporting & Analytics
**Story ID:** 6.3
**Story Type:** Feature Development
**Priority:** High
**Estimated Effort:** 6-8 hours
**Dependencies:** Story 4.6 (Leave Balance)
**Status:** Ready for Development

---

## User Story

As a **HR administrator**,
I want **to generate CSC-compliant leave reports in required formats**,
so that **I can submit accurate reports to Civil Service Commission and management**.

---

## Acceptance Criteria

1. ✅ "Leave Reports" page displays report type dropdown: Monthly Leave Report, Quarterly Leave Summary, Annual Leave Statistics, Leave Balance Report, Leave Utilization Report
2. ✅ Monthly Leave Report parameters: month/year selector, department (optional)
3. ✅ Monthly Leave Report format: employee list with columns: employee ID, name, position, VL taken, SL taken, other leaves taken, VL balance, SL balance
4. ✅ Quarterly Leave Summary aggregates monthly data for 3-month period
5. ✅ Annual Leave Statistics displays: total leave days taken, average days per employee, leave type breakdown, department comparison
6. ✅ Leave Balance Report shows current balances for all employees with columns: employee ID, name, VL balance, SL balance, other leave balances, total monetizable days
7. ✅ Leave Utilization Report calculates: (days taken / days accrued) * 100% per employee and department
8. ✅ "Generate Report" button creates report with CSC-compliant formatting
9. ✅ CSC format includes: office name, reporting period, authorized signatory, submission date
10. ✅ "Export to PDF" button generates report suitable for CSC submission
11. ✅ "Export to Excel" button downloads data for internal analysis
12. ✅ GET /api/reports/leave endpoint returns report data with type and parameters
13. ✅ Report includes visualizations: Leave Utilization by Department (bar chart), Leave Trends (line chart), Leave Type Distribution (pie chart)

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

- [ ] "Leave Reports" page displays report type dropdown: Monthly Leave Report, Quarterly Leave Summary, Annual Leave Statistics, Leave Balance Report, Leave Utilization Report
- [ ] Monthly Leave Report parameters: month/year selector, department (optional)
- [ ] Monthly Leave Report format: employee list with columns: employee ID, name, position, VL taken, SL taken, other leaves taken, VL balance, SL balance
- [ ] Quarterly Leave Summary aggregates monthly data for 3-month period
- [ ] Annual Leave Statistics displays: total leave days taken, average days per employee, leave type breakdown, department comparison
- [ ] Leave Balance Report shows current balances for all employees with columns: employee ID, name, VL balance, SL balance, other leave balances, total monetizable days
- [ ] Leave Utilization Report calculates: (days taken / days accrued) * 100% per employee and department
- [ ] "Generate Report" button creates report with CSC-compliant formatting
- [ ] CSC format includes: office name, reporting period, authorized signatory, submission date
- [ ] "Export to PDF" button generates report suitable for CSC submission
- [ ] "Export to Excel" button downloads data for internal analysis
- [ ] GET /api/reports/leave endpoint returns report data with type and parameters
- [ ] Report includes visualizations: Leave Utilization by Department (bar chart), Leave Trends (line chart), Leave Type Distribution (pie chart)

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
- [ ] Ready for 6.4 - Certificate Reports

---

**Next Story:** 6.4 - Certificate Reports
