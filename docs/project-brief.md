# Project Brief: Philippine Government HRMS

**Document Version:** 1.0  
**Date:** 2025-10-06  
**Prepared By:** Business Analyst (Mary)  
**Project Type:** Greenfield - Full-Stack Application

---

## Executive Summary

This project aims to develop a fully local, open-source Human Resources Management System (HRMS) specifically designed for small-to-medium Philippine government offices. The system will operate entirely on-premises with zero cloud dependencies, using only open-source technologies to ensure zero licensing costs and full data sovereignty.

**Target Users:** Philippine government offices with 20-500 employees  
**Deployment Model:** Fully on-premises, local network only  
**Technology Constraint:** 100% open-source stack  
**Primary Goal:** Streamline HR operations while maintaining compliance with Philippine Civil Service Commission regulations

---

## Project Background

### Problem Statement

Small-to-medium Philippine government offices currently face significant challenges in HR management:

1. **Manual Processes:** Pass slips, leave requests, and certificate generation are paper-based, leading to inefficiency and lost documents
2. **Compliance Burden:** Tracking leave credits and generating Civil Service Commission-compliant reports is time-consuming and error-prone
3. **Limited IT Resources:** Government offices have constrained budgets and cannot afford commercial HRMS solutions or cloud subscriptions
4. **Data Sovereignty Concerns:** Sensitive employee data must remain on government-controlled infrastructure
5. **Audit Trail Requirements:** Government accountability standards require comprehensive logging of all HR transactions

### Opportunity

An open-source, locally-deployed HRMS can:
- Eliminate paper-based workflows and reduce processing time
- Ensure compliance with Philippine government regulations automatically
- Provide zero-cost solution suitable for government budgets
- Maintain complete data control within government premises
- Create comprehensive audit trails for accountability

---

## Target Audience

### Primary Users

1. **Employees (20-500 per office)**
   - Submit pass slip requests
   - Apply for various leave types
   - View own leave balances and history
   - Request employment certificates

2. **Supervisors/Approvers (5-50 per office)**
   - Review and approve/deny pass slips
   - Approve leave requests for their department
   - View team leave schedules
   - Monitor department attendance patterns

3. **HR Administrators (1-5 per office)**
   - Manage employee records and leave credits
   - Generate certificates and reports
   - Configure leave accrual rules
   - Produce Civil Service Commission reports
   - Manage system workflows and approval hierarchies

4. **System Administrators (1-2 per office)**
   - User account management
   - System configuration and maintenance
   - Backup and recovery operations
   - Security and access control

### Stakeholders

- **Civil Service Commission:** Regulatory body requiring compliance
- **Office Heads/Directors:** Need visibility into HR metrics and compliance status
- **IT Personnel:** Responsible for deployment and maintenance
- **Auditors:** Require comprehensive transaction logs

---

## Core Requirements

### Module 1: Pass Slip Management

**Purpose:** Enable staff to request temporary leave from office premises with proper approval workflow

**Key Features:**
- Digital pass slip request form with required fields:
  - Employee name and ID
  - Office/department
  - Destination
  - Reason for leaving
  - Time out (requested)
  - Expected time in
  - Actual time in (recorded upon return)
  - Approval status
  - Approver name/signature
  - Date requested
  - Date approved/denied
- Multi-level approval workflow configurable by office hierarchy
- Emergency vs. planned pass slip types
- Comprehensive audit logs tracking all actions (creation, approval, denial, modifications) with timestamps and user attribution
- Email/in-app notifications for status changes
- Dashboard view for pending approvals
- Historical pass slip records and reporting

**Compliance Requirements:**
- Audit trail for all transactions
- Digital signature support for approvers
- Configurable approval chains matching government hierarchy

### Module 2: Leave Management

**Purpose:** Manage all leave types per Philippine Civil Service Commission guidelines with automated credit tracking

**Key Features:**

**Leave Types Supported:**
- Vacation Leave (VL)
- Sick Leave (SL)
- Maternity Leave
- Paternity Leave
- Special Privilege Leave (SPL)
- Solo Parent Leave
- Study Leave
- Other CSC-approved leave types

**Core Functionality:**
- Automated leave credit accrual (1.25 days VL/SL per month per CSC rules)
- Leave balance tracking with historical records
- Multi-level approval workflow with configurable routing
- Email/in-app notifications for requests and approvals
- Leave calendar view (individual and department)
- Leave conversion and monetization calculations per CSC rules
- Leave cancellation and modification workflows
- Support for half-day and hourly leave requests
- Conflict detection (overlapping leave requests)
- Leave credit carry-over rules (annual limits per CSC)

**Reporting:**
- Individual leave history and balances
- Department leave schedules
- CSC-compliant leave reports (monthly, quarterly, annual)
- Leave utilization analytics
- Exportable reports (PDF, Excel)

**Compliance Requirements:**
- Align with Civil Service Commission Memorandum Circulars
- Support Philippine holiday calendar
- Working day calculations (excluding weekends and holidays)
- Leave credit limits and expiration rules

### Module 3: Certificate Generation

**Purpose:** Auto-generate common Philippine government certificates with official formatting

**Certificate Types:**
1. Certificate of Employment
2. Certificate of Clearance
3. Certificate of Leave Credits
4. Service Record
5. Certificate of No Pending Case
6. Other customizable certificates

**Key Features:**
- Standard Philippine government letterhead templates
- Dynamic field population from employee database:
  - Employee name, position, salary grade
  - Office/department
  - Dates of service (from-to)
  - Leave credit balances
  - Other relevant employee data
- Digital signature support for authorized signatories
- Certificate issuance log for audit purposes
- Export formats:
  - PDF (for distribution and printing)
  - Editable Word format (for customization)
- Template customization capability
- Batch certificate generation
- Certificate verification system (optional: QR code with verification URL)

**Compliance Requirements:**
- Official Philippine government language and format
- Proper authorization and signatory management
- Audit trail of all certificate issuances

---

## Technical Requirements

### Deployment Architecture

**Environment:**
- Fully on-premises deployment
- Local network (LAN) only - no internet dependency for core functionality
- Windows Server primary target (most common in Philippine government)
- Linux server support (optional)

**Infrastructure Requirements:**
- Server: Windows Server 2016+ or Linux (Ubuntu 20.04+)
- Minimum Hardware: 4GB RAM, 2 CPU cores, 50GB storage
- Recommended Hardware: 8GB RAM, 4 CPU cores, 100GB storage
- Network: Local area network with static IP addressing
- Backup: External storage or NAS for database backups

### Technology Stack (100% Open Source)

**Backend Options (to be finalized in architecture phase):**
- Node.js with Express.js
- Python with Django or Flask
- PHP with Laravel
- Java with Spring Boot

**Frontend Options:**
- React.js
- Vue.js
- Vanilla JavaScript with modern frameworks

**Database Options:**
- PostgreSQL (recommended for robustness)
- MySQL/MariaDB
- SQLite (for smaller deployments)

**Document Generation:**
- Open-source PDF libraries (e.g., PDFKit, ReportLab, TCPDF)
- Open-source Word document libraries (e.g., docxtemplater, python-docx, PHPWord)

**Additional Components:**
- Web server: Apache or Nginx
- Email: Local SMTP server integration (optional)
- Authentication: Built-in authentication system (bcrypt password hashing)

### Security Requirements

**Role-Based Access Control (RBAC):**

1. **Employee Role**
   - Submit pass slips and leave requests
   - View own records, balances, and history
   - Request certificates
   - Update own profile (limited fields)

2. **Approver/Supervisor Role**
   - All Employee permissions
   - Approve/deny requests for assigned department
   - View team records and schedules
   - Generate department reports

3. **HR Administrator Role**
   - All Approver permissions
   - Manage all employee records
   - Configure leave credits and accrual rules
   - Generate all certificates
   - Access all reports and analytics
   - Configure system workflows
   - Manage approval hierarchies

4. **System Administrator Role**
   - Full system access
   - User account management
   - Role assignment
   - System configuration
   - Database backup/restore
   - Audit log access
   - Security settings

**Authentication & Authorization:**
- Secure login with username/password
- Password policies compliant with Philippine government cybersecurity standards:
  - Minimum 8 characters
  - Complexity requirements (uppercase, lowercase, numbers, special characters)
  - Password expiration (90 days recommended)
  - Account lockout after failed attempts
- Session management with timeout
- Password reset functionality (admin-assisted)

**Data Security:**
- Encrypted password storage (bcrypt or Argon2)
- HTTPS/TLS for web interface (self-signed certificates acceptable for local network)
- SQL injection prevention
- XSS and CSRF protection
- Input validation and sanitization
- Compliance with Data Privacy Act of 2012 (RA 10173)

**Audit Trail:**
- Comprehensive logging of all transactions:
  - User actions (create, read, update, delete)
  - Timestamp of each action
  - User attribution (who performed the action)
  - Before/after values for modifications
  - IP address and session information
- Tamper-proof audit logs
- Audit log retention policy (minimum 3 years recommended)
- Audit log search and reporting capabilities

### Database Design Requirements

**Schema Requirements:**
- Fully normalized database design (3NF minimum)
- Entity-Relationship Diagram (ERD)
- Tables required (minimum):
  - Users/Employees
  - Departments/Offices
  - Pass Slips
  - Leave Requests
  - Leave Types
  - Leave Credits
  - Leave Balances
  - Certificates
  - Approval Workflows
  - Audit Logs
  - System Configuration
- Foreign key constraints for referential integrity
- Indexes for performance optimization
- Migration scripts for initial setup and future updates

**Data Integrity:**
- Transaction support (ACID compliance)
- Cascading rules for deletions
- Data validation at database level
- Backup and recovery procedures

---

## Success Criteria

### Functional Success Metrics

1. **Pass Slip Processing:**
   - 90% reduction in paper-based pass slips within 3 months
   - Average approval time reduced from 24 hours to 4 hours
   - Zero lost pass slip records

2. **Leave Management:**
   - 100% accurate leave credit tracking
   - 95% reduction in leave calculation errors
   - CSC report generation time reduced from 2 days to 15 minutes

3. **Certificate Generation:**
   - Certificate generation time reduced from 30 minutes to 2 minutes
   - 100% consistent formatting across all certificates
   - Complete audit trail for all issued certificates

### Technical Success Metrics

1. **System Performance:**
   - Page load time < 2 seconds
   - Support 100 concurrent users
   - 99.5% uptime during business hours
   - Database query response time < 500ms

2. **Security:**
   - Zero security breaches
   - 100% audit trail coverage
   - Compliance with Data Privacy Act

3. **Usability:**
   - 80% user adoption within first month
   - < 2 hours training time for basic users
   - < 5 support tickets per week after initial deployment

### Deployment Success Metrics

1. **Installation:**
   - Deployable by government IT staff with basic technical skills
   - Installation time < 4 hours
   - Complete documentation provided

2. **Maintenance:**
   - Backup procedures executable by non-expert staff
   - System updates deployable without downtime
   - Troubleshooting guide resolves 80% of common issues

---

## Constraints & Assumptions

### Constraints

1. **Budget:** Zero cost for software licenses
2. **Technology:** 100% open-source stack only
3. **Connectivity:** No external API calls or cloud services
4. **Deployment:** Must work offline after initial setup
5. **Skills:** Deployable by government IT staff with basic technical skills
6. **Infrastructure:** Must run on typical government office hardware (Windows Server)

### Assumptions

1. Government office has basic IT infrastructure (server, network, workstations)
2. Users have basic computer literacy
3. Office has designated IT personnel for system administration
4. Internet connectivity available for initial setup and updates (but not required for operation)
5. Office follows standard Philippine government HR policies and CSC regulations
6. Existing employee data can be imported via CSV/Excel format

---

## Out of Scope (Phase 1)

The following features are explicitly out of scope for the initial release:

1. **Payroll Integration:** Salary calculation and disbursement
2. **Time and Attendance (DTR):** Biometric integration, clock in/out
3. **Performance Management:** Performance reviews, KPIs, 360 feedback
4. **Recruitment:** Job postings, applicant tracking
5. **Training Management:** Training schedules, certifications
6. **Mobile Applications:** Native iOS/Android apps (mobile-responsive web is in scope)
7. **Cloud Deployment:** SaaS or cloud-hosted versions
8. **Multi-office/Multi-tenant:** System designed for single office deployment
9. **Advanced Analytics:** AI/ML-based predictions, advanced data visualization
10. **External Integrations:** Third-party HR systems, government portals

*Note: These features may be considered for future phases based on user feedback and requirements.*

---

## Project Deliverables

### Phase 1: Planning & Design
1. ✅ Project Brief (this document)
2. Product Requirements Document (PRD) - *Next: PM Agent*
3. System Architecture Document - *Next: Architect Agent*
4. Database Schema & ERD - *Next: Architect Agent*
5. UI/UX Specifications - *Next: UX Expert Agent*

### Phase 2: Development
1. Backend API implementation
2. Frontend application
3. Database setup scripts
4. Certificate templates (Word/PDF)
5. Sample data for testing

### Phase 3: Documentation & Deployment
1. Installation guide
2. User manual (per role)
3. System administrator guide
4. API documentation
5. Troubleshooting guide
6. Backup/recovery procedures

### Phase 4: Testing & Handover
1. Test cases and test results
2. Security audit report
3. Performance test results
4. Training materials
5. Deployment checklist

---

## Risks & Mitigation Strategies

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Limited government IT infrastructure | High | Medium | Design for minimal hardware requirements; provide detailed installation guide |
| Lack of technical expertise for deployment | High | Medium | Create step-by-step installation wizard; provide remote support during initial deployment |
| Data migration from existing systems | Medium | High | Build robust CSV/Excel import tools; provide data mapping templates |
| Browser compatibility issues | Medium | Low | Test on common browsers (Chrome, Firefox, Edge); provide compatibility guide |

### Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User resistance to change | High | Medium | Provide comprehensive training; demonstrate time savings; phased rollout |
| Incomplete requirements understanding | High | Low | Engage actual government HR staff for validation; iterative feedback |
| CSC regulation changes | Medium | Low | Design flexible configuration system; maintain update mechanism |

### Compliance Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data Privacy Act non-compliance | High | Low | Implement comprehensive security measures; conduct privacy impact assessment |
| CSC reporting format changes | Medium | Medium | Use configurable report templates; maintain documentation of CSC requirements |
| Audit trail inadequacy | High | Low | Implement comprehensive logging from day one; regular audit log reviews |

---

## Next Steps

1. **Review & Approval:** Stakeholder review of this project brief
2. **PM Agent:** Create detailed Product Requirements Document (PRD)
3. **Architect Agent:** Design system architecture and database schema
4. **UX Expert Agent:** Create UI/UX specifications and wireframes
5. **Development:** Begin implementation following approved designs
6. **Testing:** Comprehensive testing with actual government office users
7. **Deployment:** Pilot deployment in 1-2 government offices
8. **Iteration:** Gather feedback and refine before wider rollout

---

## Appendices

### Appendix A: Philippine Government Context

**Civil Service Commission (CSC) Regulations:**
- Leave credits: 1.25 days VL/SL per month (15 days per year)
- Maximum leave credit accumulation varies by leave type
- Leave monetization rules for retiring employees
- Mandatory leave reporting formats

**Data Privacy Act of 2012 (RA 10173):**
- Personal data protection requirements
- Consent mechanisms for data processing
- Data breach notification procedures
- Rights of data subjects

**Government Cybersecurity Standards:**
- Password complexity requirements
- Access control policies
- Audit trail requirements
- Incident response procedures

### Appendix B: Reference Documents

- Civil Service Commission Memorandum Circulars on Leave Administration
- Data Privacy Act of 2012 (RA 10173) and IRR
- Government Information Systems Management Manual
- Philippine Standard Time (PST) and holiday calendar

### Appendix C: Glossary

- **CSC:** Civil Service Commission - regulatory body for Philippine civil service
- **VL:** Vacation Leave
- **SL:** Sick Leave
- **SPL:** Special Privilege Leave
- **DTR:** Daily Time Record (attendance tracking)
- **HRMS:** Human Resources Management System
- **RBAC:** Role-Based Access Control
- **ERD:** Entity-Relationship Diagram
- **On-premises:** Deployed on local infrastructure, not cloud-based

---

**Document Status:** ✅ Complete - Ready for PM Agent Review

**Recommended Next Command:** `*exit` (return to orchestrator) then `*agent pm` to create PRD

