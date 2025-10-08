# Philippine Government HRMS - Sprint Plan

**Project:** Philippine Government HRMS  
**Prepared By:** Scrum Master (Sarah)  
**Date:** 2025-10-06  
**Team Size:** 3 Developers  
**Sprint Duration:** 2 weeks (10 working days)  
**Team Capacity:** 240 hours per sprint (80 hours per developer)

---

## Sprint Planning Overview

### Development Strategy

**Sequential Epic Approach:**
- Epic 1 (Foundation) must be completed first - all other work depends on it
- Epic 2 (Employee Management) must be completed second - required by Epics 3-6
- Epics 3-6 can be developed in parallel after Epic 2

**Recommended Team Allocation:**
- **Sprint 1-2:** All 3 developers on Epic 1 (Foundation)
- **Sprint 3:** All 3 developers on Epic 2 (Employee Management)
- **Sprint 4-6:** Parallel development of Epics 3, 4, 5, 6

---

## Sprint 1: Foundation - Part 1

**Duration:** 2 weeks  
**Goal:** Establish project foundation with authentication and database  
**Team Capacity:** 240 hours  
**Planned Work:** 220-244 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 1.1 | Project Setup & Development Environment | Critical | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 1.2 | Database Schema Foundation | Critical | 6-8h | Dev 1 (Alex) | ✅ Complete |
| 1.3 | User Authentication System | Critical | 6-8h | Dev 1 (Alex) | ✅ Complete |
| 1.4 | Role-Based Access Control (RBAC) | Critical | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 1.5 | User Management Interface | High | 6-8h | Dev 1 (Alex) | ✅ Complete |
| 1.6 | Password Management | High | 4-6h | Dev 1 (Alex) | ✅ Complete |

### Sprint Goals

1. ✅ Complete project setup with all tooling configured
2. ✅ Database schema deployed and seeded
3. ✅ Authentication system functional (login/logout)
4. ✅ RBAC implemented with 4 roles
5. ✅ User management interface operational
6. ✅ Password management with complexity rules working

### Dependencies

- **None** - This is the foundation sprint

### Risks & Mitigation

- **Risk:** Database schema changes during development
  - **Mitigation:** Use migrations for all schema changes
- **Risk:** Authentication complexity underestimated
  - **Mitigation:** Dev 2 focuses exclusively on auth stories

### Definition of Done

- [ ] All 6 stories completed and tested
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged to main branch
- [ ] Database migrations tested
- [ ] Authentication working end-to-end
- [ ] User management CRUD operations functional
- [ ] Sprint demo prepared

---

## Sprint 2: Employee Management & Core Data

**Duration:** 2 weeks  
**Goal:** Complete employee management module and core data structures  
**Team Capacity:** 240 hours  
**Planned Work:** 226-236 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 2.1 | Department Management | High | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 2.2 | Employee Profile Management | High | 8-10h | Dev 1 (Alex) | ✅ Complete |
| 2.3 | Employee Bulk Import | Medium | 6-8h | Dev 1 (Alex) | ✅ Complete |
| 2.4 | Employee Search and Filtering | Medium | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 2.5 | Holiday Calendar Management | Medium | 4-6h | Dev 1 (Alex) | ✅ Complete |

**Epic 3: Pass Slip Management**

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 3.1 | Pass Slip Request Form | High | 6-8h | Dev 1 (Alex) | ✅ Complete |
| 3.2 | Pass Slip Approval Workflow | High | 8-10h | Dev 1 (Alex) | ✅ Complete |
| 3.3 | Pass Slip Time Tracking | Medium | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 3.4 | Pass Slip History and Search | Medium | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 3.5 | Pass Slip Workflow Configuration | Low | 6-8h | Dev 1 (Alex) | ✅ Complete |

**Epic 4: Leave Management System**

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 4.1 | Leave Types Configuration | Medium | 4-6h | Dev 1 (Alex) | ✅ Complete |
| 4.2 | Leave Credit Accrual System | High | 8-10h | Dev 1 (Alex) | ✅ Complete |
| 4.3 | Leave Request Form | High | 8-10h | Dev 1 (Alex) | ✅ Complete |
| 4.4 | Leave Approval Workflow | High | 8-10h | Dev 1 (Alex) | ✅ Complete |
| 4.5 | Leave Calendar and Conflict Detection | Medium | 6-8h | Dev 2 (Alex) | ✅ Complete |
| 4.6 | Leave Balance Tracking | High | 6-8h | Dev 2 (Alex) | ✅ Complete |
| 4.7 | Leave Cancellation and Modification | Medium | 4-6h | Dev 3 (Alex) | ✅ Complete |
| 4.8 | Leave Monetization Calculation | Low | 6-8h | Dev 3 (Alex) | ✅ Complete |

### Sprint Goals

1. ✅ Department hierarchy management operational
2. ✅ Employee CRUD operations complete
3. ✅ Bulk import wizard functional
4. ✅ Advanced search and filtering working
5. ✅ Philippine holiday calendar populated

### Dependencies

- **Requires:** Sprint 1 complete (authentication, database, user management)

### Risks & Mitigation

- **Risk:** Bulk import complexity (CSV parsing, validation)
  - **Mitigation:** Use proven library (e.g., PapaParse), allocate extra time
- **Risk:** Department hierarchy circular reference bugs
  - **Mitigation:** Implement validation early, write comprehensive tests

### Definition of Done

- [ ] All 5 stories completed and tested
- [ ] Department tree view working correctly
- [ ] Employee profiles can be created, edited, viewed
- [ ] Bulk import successfully imports 100+ employee test dataset
- [ ] Search returns results in < 1 second
- [ ] Holiday calendar displays Philippine holidays
- [ ] Sprint demo prepared

---

## Sprint 3: Pass Slip Management

**Duration:** 2 weeks  
**Goal:** Deliver complete pass slip module with approval workflow  
**Team Capacity:** 240 hours  
**Planned Work:** 228-238 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 3.1 | Pass Slip Request Form | High | 6-8h | Dev 1 | 📝 Not Started |
| 3.2 | Pass Slip Approval Workflow | High | 8-10h | Dev 1 | 📝 Not Started |
| 3.3 | Pass Slip Time Tracking | Medium | 4-6h | Dev 2 | 📝 Not Started |
| 3.4 | Pass Slip History and Search | Medium | 4-6h | Dev 2 | 📝 Not Started |
| 3.5 | Pass Slip Workflow Configuration | Low | 6-8h | Dev 3 | 📝 Not Started |

### Sprint Goals

1. ✅ Employees can submit pass slip requests
2. ✅ Supervisors can approve/deny requests
3. ✅ Time tracking (time out/in) functional
4. ✅ Pass slip history searchable
5. ✅ Workflow configuration interface operational

### Dependencies

- **Requires:** Sprint 2 complete (employee data, departments)

### Risks & Mitigation

- **Risk:** Approval workflow complexity (multi-level approvals)
  - **Mitigation:** Start with single-level approval, add multi-level incrementally
- **Risk:** Notification system not yet implemented
  - **Mitigation:** Use in-app notifications only for MVP, email later

### Definition of Done

- [ ] All 5 stories completed and tested
- [ ] Pass slip request form validates correctly
- [ ] Approval workflow routes to correct supervisor
- [ ] Time tracking records actual return time
- [ ] History page displays all pass slips with filters
- [ ] Workflow configuration saves and applies correctly
- [ ] Sprint demo prepared

---

## Sprint 4: Leave Management - Part 1

**Duration:** 2 weeks  
**Goal:** Implement leave types, accrual system, and request submission  
**Team Capacity:** 240 hours  
**Planned Work:** 220-234 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 4.1 | Leave Types Configuration | High | 4-6h | Dev 1 | 📝 Not Started |
| 4.2 | Leave Credit Accrual System | Critical | 8-10h | Dev 1 | 📝 Not Started |
| 4.3 | Leave Request Form | High | 8-10h | Dev 2 | 📝 Not Started |
| 4.4 | Leave Approval Workflow | High | 8-10h | Dev 3 | 📝 Not Started |

### Sprint Goals

1. ✅ CSC leave types configured (VL, SL, Maternity, etc.)
2. ✅ Monthly accrual job functional
3. ✅ Leave request form with balance checking
4. ✅ Leave approval workflow operational

### Dependencies

- **Requires:** Sprint 2 complete (employee data)
- **Requires:** Holiday calendar (Story 2.5)

### Risks & Mitigation

- **Risk:** Accrual calculation complexity (CSC rules, prorating)
  - **Mitigation:** Dev 1 focuses exclusively on accrual logic, write extensive tests
- **Risk:** Working days calculation (excluding holidays/weekends)
  - **Mitigation:** Use date library (e.g., date-fns), test with Philippine holidays

### Definition of Done

- [ ] All 4 stories completed and tested
- [ ] Leave types seeded with CSC defaults
- [ ] Accrual job runs successfully (test with manual trigger)
- [ ] Leave request form calculates working days correctly
- [ ] Approval workflow deducts credits on approval
- [ ] Sprint demo prepared

---

## Sprint 5: Leave Management - Part 2

**Duration:** 2 weeks  
**Goal:** Complete leave management with calendar, balance tracking, and modifications  
**Team Capacity:** 240 hours  
**Planned Work:** 220-234 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 4.5 | Leave Calendar and Conflict Detection | Medium | 6-8h | Dev 1 | ✅ Complete |
| 4.6 | Leave Balance Tracking | High | 6-8h | Dev 2 | ✅ Complete |
| 4.7 | Leave Cancellation and Modification | Medium | 4-6h | Dev 3 | ✅ Complete |
| 4.8 | Leave Monetization Calculation | Medium | 6-8h | Dev 3 | ✅ Complete |

### Sprint Goals

1. ✅ Leave calendar displays approved leaves
2. ✅ Conflict detection warns when 50%+ of team on leave
3. ✅ Balance tracking shows transaction history
4. ✅ Leave cancellation restores credits
5. ✅ Monetization calculation for retiring employees

### Dependencies

- **Requires:** Sprint 4 complete (leave types, accrual, requests, approvals)

### Definition of Done

- [ ] All 4 stories completed and tested
- [ ] Calendar view displays leaves correctly
- [ ] Conflict detection triggers warnings
- [ ] Balance page shows accurate balances and history
- [ ] Cancellation restores credits correctly
- [ ] Monetization calculation matches CSC rules
- [ ] Sprint demo prepared

---

## Sprint 6: Certificate Generation & Reporting

**Duration:** 2 weeks  
**Goal:** Deliver certificate generation and comprehensive reporting  
**Team Capacity:** 240 hours  
**Planned Work:** 228-248 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 5.1 | Certificate Template Management | High | 6-8h | Dev 1 | ✅ Complete |
| 5.2 | Certificate Generation Interface | High | 8-10h | Dev 1 | ✅ Complete |
| 5.3 | Digital Signature Management | Medium | 4-6h | Dev 2 | ✅ Complete |
| 5.4 | Certificate Issuance Log | Medium | 4-6h | Dev 2 | ✅ Complete |
| 5.5 | Batch Certificate Generation | Low | 6-8h | Dev 2 | ✅ Complete |
| 6.1 | Dashboard Analytics | High | 8-10h | Dev 3 | ✅ Complete |

### Sprint Goals

1. ✅ Certificate templates created and editable
2. ✅ PDF generation working with employee data
3. ✅ Digital signatures uploadable and applied
4. ✅ Certificate issuance log tracking all certificates
5. ✅ Batch generation for multiple employees
6. ✅ Role-based dashboards displaying key metrics

### Dependencies

- **Requires:** Sprint 2 complete (employee data)
- **Requires:** Sprint 5 complete (leave balances for certificate data)

### Definition of Done

- [ ] All 6 stories completed and tested
- [ ] Certificate templates support dynamic fields
- [ ] PDF generation produces valid PDFs
- [ ] Digital signatures appear on certificates
- [ ] Issuance log tracks all certificates
- [ ] Batch generation creates ZIP of PDFs
- [ ] Dashboards display correct data per role
- [ ] Sprint demo prepared

---

## Sprint 7: Final Reporting & Polish

**Duration:** 2 weeks  
**Goal:** Complete all reporting features and system polish  
**Team Capacity:** 240 hours  
**Planned Work:** 224-234 hours

### Stories

| Story ID | Title | Priority | Effort | Assignee | Status |
|----------|-------|----------|--------|----------|--------|
| 6.2 | Pass Slip Reports | Medium | 4-6h | Dev 1 | ✅ Complete |
| 6.3 | Leave Reports (CSC Compliance) | High | 6-8h | Dev 1 | ✅ Complete |
| 6.4 | Certificate Reports | Medium | 4-6h | Dev 2 | ✅ Complete |
| 6.5 | Audit Log Viewer | Medium | 6-8h | Dev 2 | ✅ Complete |
| 6.6 | Employee Reports | Medium | 4-6h | Dev 3 | ✅ Complete |

**Plus:** System testing, bug fixes, documentation, deployment preparation

### Sprint Goals

1. ✅ All reporting features complete
2. ✅ CSC-compliant leave reports generated
3. ✅ Audit log viewer operational
4. ✅ All bugs from previous sprints resolved
5. ✅ System ready for UAT (User Acceptance Testing)

### Dependencies

- **Requires:** All previous sprints complete

### Definition of Done

- [ ] All 5 stories completed and tested
- [ ] All reports generate correctly (PDF/Excel)
- [ ] CSC leave report format validated
- [ ] Audit log searchable and exportable
- [ ] All critical/high priority bugs resolved
- [ ] User documentation complete
- [ ] Deployment guide complete
- [ ] System ready for UAT
- [ ] Final demo prepared

---

## Project Timeline Summary

**Total Duration:** 14 weeks (3.5 months)  
**Total Sprints:** 7 sprints × 2 weeks each

### Milestone Schedule

- **Week 2:** Sprint 1 complete - Foundation ready
- **Week 4:** Sprint 2 complete - Employee management operational
- **Week 6:** Sprint 3 complete - Pass slip module live
- **Week 8:** Sprint 4 complete - Leave management Part 1 done
- **Week 10:** Sprint 5 complete - Leave management complete
- **Week 12:** Sprint 6 complete - Certificates and dashboards ready
- **Week 14:** Sprint 7 complete - **System ready for UAT**

---

## Success Metrics

### Velocity Tracking

- **Target Velocity:** 220-240 hours per sprint
- **Actual Velocity:** To be measured after Sprint 1

### Quality Metrics

- **Code Coverage:** Minimum 70% for critical paths
- **Bug Rate:** < 5 critical bugs per sprint
- **Story Completion Rate:** 100% of committed stories

### Team Health

- **Sprint Retrospectives:** After each sprint
- **Daily Standups:** 15 minutes, 9:00 AM
- **Sprint Reviews:** Demo to stakeholders every 2 weeks

---

**Scrum Master:** Sarah  
**Product Owner:** Emma  
**Development Team:** 3 Developers (to be assigned)

---

*This sprint plan will be updated after each sprint based on actual velocity and changing priorities.*

