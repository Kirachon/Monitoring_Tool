# Philippine Government HRMS - Product Requirements Document (PRD)

**Document Version:** 1.0  
**Date:** 2025-10-06  
**Prepared By:** Product Manager (John)  
**Project Type:** Greenfield - Full-Stack Application  
**Status:** Draft - Ready for Architecture Phase

---

## Goals and Background Context

### Goals

- Eliminate paper-based HR workflows (pass slips, leave requests, certificates) and reduce processing time by 90%
- Ensure automatic compliance with Philippine Civil Service Commission regulations and reporting requirements
- Provide zero-cost HRMS solution suitable for government budgets with limited IT resources
- Maintain complete data sovereignty with all employee data on government-controlled infrastructure
- Create comprehensive audit trails for all HR transactions to meet government accountability standards
- Reduce leave calculation errors by 95% through automated leave credit tracking
- Reduce certificate generation time from 30 minutes to 2 minutes with standardized templates
- Support 20-500 employees per office with 99.5% uptime during business hours
- Achieve 80% user adoption within first month with less than 2 hours training time per user through intuitive interface design

### Background Context

Small-to-medium Philippine government offices face significant HR management challenges due to manual, paper-based processes for pass slips, leave requests, and certificate generation. This leads to inefficiency, lost documents, time-consuming compliance reporting, and error-prone leave credit tracking. With constrained budgets, these offices cannot afford commercial HRMS solutions or cloud subscriptions, and data sovereignty concerns require that sensitive employee data remain on government-controlled infrastructure.

An open-source, locally-deployed HRMS addresses these challenges by automating workflows, ensuring CSC compliance, providing a zero-cost solution, and maintaining complete data control within government premises. The system will streamline operations for 20-500 employees per office while meeting Philippine government cybersecurity standards and Data Privacy Act requirements.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-06 | 1.0 | Initial PRD creation from project brief | PM Agent (John) |

---

## Requirements

### Functional Requirements

**Pass Slip Management Module:**

- **FR1:** The system shall provide a digital pass slip request form capturing employee name, employee ID, office/department, destination, reason for leaving, time out, expected time in, actual time in, approval status, approver name/signature, date requested, and date approved/denied.
- **FR2:** The system shall support configurable multi-level approval workflows that match Philippine government office hierarchies.
- **FR3:** The system shall distinguish between emergency and planned pass slip request types with different approval routing rules.
- **FR4:** The system shall send email/in-app notifications to approvers when pass slips are submitted and to requestors when status changes occur.
- **FR5:** The system shall provide a dashboard view for supervisors showing all pending pass slip approvals for their department.
- **FR6:** The system shall maintain complete historical records of all pass slips with search and filtering capabilities.
- **FR7:** The system shall record actual time in when employees return and flag overdue returns.

**Leave Management Module:**

- **FR8:** The system shall support all Philippine Civil Service Commission leave types: Vacation Leave (VL), Sick Leave (SL), Maternity Leave, Paternity Leave, Special Privilege Leave (SPL), Solo Parent Leave, Study Leave, and other CSC-approved types.
- **FR9:** The system shall automatically accrue leave credits at 1.25 days VL/SL per month per CSC rules, with configurable accrual rates for other leave types.
- **FR10:** The system shall track leave balances in real-time, deducting approved leave and adding accrued credits automatically.
- **FR11:** The system shall support leave requests with configurable multi-level approval workflows and email/in-app notifications.
- **FR12:** The system shall provide calendar views showing individual and department leave schedules with conflict detection for overlapping requests.
- **FR13:** The system shall support leave cancellation and modification workflows with approval requirements.
- **FR14:** The system shall support half-day and hourly leave requests with appropriate credit deductions.
- **FR15:** The system shall calculate leave conversions and monetization per CSC rules for retiring employees.
- **FR16:** The system shall enforce leave credit carry-over rules and annual limits per CSC regulations.
- **FR17:** The system shall generate CSC-compliant leave reports (monthly, quarterly, annual) in required formats.
- **FR18:** The system shall calculate working days excluding Philippine holidays and weekends for leave duration calculations.

**Certificate Generation Module:**

- **FR19:** The system shall auto-generate Certificate of Employment, Certificate of Clearance, Certificate of Leave Credits, Service Record, Certificate of No Pending Case, and other customizable certificates.
- **FR20:** The system shall use standard Philippine government letterhead templates with official formatting and language.
- **FR21:** The system shall dynamically populate certificate fields from employee database including name, position, salary grade, office, dates of service, leave balances, and other relevant data.
- **FR22:** The system shall support digital signatures for authorized signatories with signature image upload and positioning.
- **FR23:** The system shall export certificates in both PDF format (for distribution) and editable Word format (for customization).
- **FR24:** The system shall allow HR administrators to customize certificate templates and add new certificate types.
- **FR25:** The system shall support batch certificate generation for multiple employees.
- **FR26:** The system shall maintain a certificate issuance log recording all generated certificates with timestamp, issuer, and recipient.

**User Management & Security:**

- **FR27:** The system shall implement role-based access control with four roles: Employee, Approver/Supervisor, HR Administrator, and System Administrator.
- **FR28:** The system shall provide secure login with username/password authentication and session management.
- **FR29:** The system shall allow employees to view and update their own profile information (limited fields).
- **FR30:** The system shall allow HR administrators to manage all employee records including personal information, position, salary grade, department, and employment dates.
- **FR31:** The system shall allow system administrators to create, modify, and deactivate user accounts and assign roles.
- **FR32:** The system shall allow HR administrators to configure approval workflows and hierarchies per department.

**Reporting & Analytics:**

- **FR33:** The system shall provide dashboard views showing key metrics: pending approvals, leave utilization, upcoming leaves, and certificate requests.
- **FR34:** The system shall generate exportable reports (PDF, Excel) for all modules including pass slips, leave history, leave balances, and certificate issuances.
- **FR35:** The system shall provide department-level reports for supervisors showing team attendance patterns and leave schedules.
- **FR36:** The system shall generate audit reports showing all system transactions with user attribution and timestamps.

**Data Management:**

- **FR37:** The system shall support bulk import of employee data via CSV/Excel files with data validation and error reporting.
- **FR38:** The system shall support bulk export of all system data for backup and reporting purposes.
- **FR39:** The system shall maintain referential integrity across all database tables with foreign key constraints.

### Non-Functional Requirements

**Performance:**

- **NFR1:** The system shall load pages in less than 2 seconds under normal network conditions.
- **NFR2:** The system shall support 100 concurrent users without performance degradation.
- **NFR3:** The system shall respond to database queries in less than 500 milliseconds.
- **NFR4:** The system shall achieve 99.5% uptime during business hours (8 AM - 5 PM, Monday-Friday).

**Security:**

- **NFR5:** The system shall store passwords using bcrypt or Argon2 hashing with appropriate salt.
- **NFR6:** The system shall enforce password policies: minimum 8 characters, complexity requirements (uppercase, lowercase, numbers, special characters), 90-day expiration, and account lockout after 5 failed attempts.
- **NFR7:** The system shall implement session timeout after 30 minutes of inactivity.
- **NFR8:** The system shall prevent SQL injection, XSS, and CSRF attacks through input validation and sanitization.
- **NFR9:** The system shall support HTTPS/TLS for web interface encryption (self-signed certificates acceptable for local network).
- **NFR10:** The system shall comply with Data Privacy Act of 2012 (RA 10173) requirements for personal data protection.
- **NFR11:** The system shall maintain comprehensive audit logs that are tamper-proof and retained for minimum 3 years.

**Usability:**

- **NFR12:** The system shall provide an intuitive interface requiring less than 2 hours training for basic users.
- **NFR13:** The system shall be mobile-responsive, accessible on tablets and smartphones via local network.
- **NFR14:** The system shall provide clear error messages and validation feedback to users.
- **NFR15:** The system shall support Philippine English language conventions and terminology.

**Deployment & Operations:**

- **NFR16:** The system shall be deployable on Windows Server 2016+ or Linux (Ubuntu 20.04+) with documented installation procedures.
- **NFR17:** The system shall operate entirely on-premises with zero internet dependency for core functionality.
- **NFR18:** The system shall use 100% open-source technologies with zero licensing costs.
- **NFR19:** The system shall be installable by government IT staff with basic technical skills in less than 4 hours.
- **NFR20:** The system shall run on minimum hardware: 4GB RAM, 2 CPU cores, 50GB storage (recommended: 8GB RAM, 4 CPU cores, 100GB storage).
- **NFR21:** The system shall provide database backup and recovery procedures executable by non-expert staff.
- **NFR22:** The system shall include comprehensive documentation: installation guide, user manuals per role, administrator guide, and troubleshooting guide.

**Scalability:**

- **NFR23:** The system shall support 20-500 employees per office deployment.
- **NFR24:** The system shall handle database growth of up to 10 years of historical data without performance degradation.

**Compliance:**

- **NFR25:** The system shall align with Philippine Civil Service Commission rules and regulations for leave administration.
- **NFR26:** The system shall calculate working days using the official Philippine holiday calendar.
- **NFR27:** The system shall generate reports in formats compliant with Civil Service Commission requirements.

---

## User Interface Design Goals

### Overall UX Vision

The HRMS interface shall embody simplicity and efficiency, designed for government employees with varying levels of computer literacy. The system prioritizes task completion speed, clear information hierarchy, and minimal clicks to accomplish common actions. The design philosophy follows "government-friendly" principles: professional appearance, high contrast for readability, large touch targets for tablet use, and clear labeling over iconography. The interface shall feel familiar to users accustomed to basic office software while introducing modern conveniences like real-time notifications and dashboard widgets.

### Key Interaction Paradigms

- **Dashboard-Centric Navigation:** Users land on role-appropriate dashboards showing pending actions, recent activity, and quick-access widgets
- **Wizard-Based Forms:** Multi-step forms for complex processes (leave requests, certificate generation) with progress indicators and validation at each step
- **Approval Workflows:** Clear visual indicators of approval status with one-click approve/deny actions and comment capabilities
- **Calendar-Based Scheduling:** Interactive calendar views for leave planning with color-coded leave types and conflict warnings
- **Search-First Data Access:** Prominent search functionality for finding employees, historical records, and documents
- **Contextual Actions:** Action buttons appear contextually based on user role and record status (e.g., "Approve" only visible to authorized approvers)

### Core Screens and Views

1. **Login Screen** - Simple username/password with password reset link
2. **Employee Dashboard** - Personal leave balance, pending requests, quick actions (submit pass slip, request leave)
3. **Supervisor Dashboard** - Pending approvals, team calendar, department metrics
4. **HR Administrator Dashboard** - System-wide metrics, recent activities, quick access to all modules
5. **Pass Slip Request Form** - Wizard-style form with validation and preview before submission
6. **Pass Slip Approval Queue** - List view with filters, bulk actions, and quick approve/deny
7. **Leave Request Form** - Multi-step wizard with leave type selection, date picker, balance display, and conflict checking
8. **Leave Calendar View** - Monthly/weekly calendar showing individual or department leaves with color coding
9. **Leave Balance View** - Detailed breakdown of leave credits by type with accrual history
10. **Certificate Generation Interface** - Template selection, field preview, batch generation options
11. **Employee Management** - CRUD interface for HR administrators with search, filters, and bulk import
12. **Reports Interface** - Report type selection, parameter input, preview, and export options
13. **System Configuration** - Settings for approval workflows, leave rules, holidays, and user management
14. **Audit Log Viewer** - Searchable, filterable log of all system transactions

### Accessibility

**WCAG AA Compliance** - The system shall meet WCAG 2.1 Level AA standards including:
- Sufficient color contrast ratios (4.5:1 for normal text)
- Keyboard navigation for all interactive elements
- Screen reader compatibility with proper ARIA labels
- Resizable text up to 200% without loss of functionality
- Clear focus indicators for keyboard users

### Branding

The system shall use **Philippine government standard visual identity**:
- Official government seal placement on letterheads and certificates
- Conservative color palette: Navy blue (#003f87) for headers, gray (#6c757d) for secondary elements, white backgrounds
- Professional sans-serif fonts (e.g., Open Sans, Roboto) for readability
- Formal tone in all system messages and labels
- Consistent spacing and alignment following government document standards

### Target Device and Platforms

**Web Responsive (Desktop-First, Mobile-Friendly)**
- Primary: Desktop browsers (Chrome, Firefox, Edge) on Windows workstations (1366x768 minimum resolution)
- Secondary: Tablets (iPad, Android tablets) for supervisors approving on-the-go via local network
- Tertiary: Smartphones for viewing information (not optimized for data entry)
- No native mobile apps - responsive web interface accessible via local network only

---

## Technical Assumptions

### Repository Structure: Monorepo

**Decision:** Single repository containing both frontend and backend code.

**Rationale:** For a small-to-medium government office deployment with limited IT resources, a monorepo simplifies deployment, version control, and maintenance. All code is versioned together, reducing complexity for government IT staff who may have basic technical skills.

### Service Architecture

**Architecture Type:** Monolithic application with modular structure

**Rationale:** 
- **Simplicity:** Easier to deploy, maintain, and troubleshoot for government IT staff with limited expertise
- **Performance:** Lower latency with in-process communication, suitable for local network deployment
- **Resource Efficiency:** Single application server reduces hardware requirements and operational complexity
- **Offline Operation:** Monolith is simpler to run without external dependencies or service orchestration
- **Modular Design:** Code organized into clear modules (PassSlip, Leave, Certificate, User) for maintainability while avoiding microservices complexity

**Components:**
- Web server (Apache/Nginx) serving static frontend files
- Application server running backend API
- Database server (PostgreSQL)
- All components deployable on single server or separated as needed

### Testing Requirements

**Testing Strategy:** Unit + Integration testing with manual testing support

**Requirements:**
- **Unit Tests:** Core business logic (leave calculations, approval workflows, credit accruals) with 80% code coverage target
- **Integration Tests:** API endpoints, database operations, and module interactions
- **Manual Testing:** UI workflows, certificate generation, report exports (documented test cases provided)
- **Test Data:** Seed scripts with sample employees, leave records, and pass slips for testing
- **Testing Tools:** Open-source frameworks (Jest/Mocha for Node.js, pytest for Python, PHPUnit for PHP)

**Rationale:** Automated testing for critical calculations and workflows ensures accuracy (especially for CSC compliance), while manual testing covers UI/UX and document generation where visual verification is essential.

### Additional Technical Assumptions and Requests

**Technology Stack Recommendations (Final decision for Architect):**

**Backend Framework Options:**
- **Option 1 (Recommended):** Node.js with Express.js - Lightweight, excellent ecosystem, JavaScript full-stack consistency
- **Option 2:** Python with Django - Batteries-included framework, excellent for rapid development, strong ORM
- **Option 3:** PHP with Laravel - Familiar to many government IT staff, mature ecosystem, good documentation

**Frontend Framework:**
- **Recommended:** Vue.js - Gentle learning curve, excellent documentation, suitable for government IT staff maintenance
- **Alternative:** React - Larger ecosystem, more resources available, slightly steeper learning curve

**Database:**
- **Recommended:** PostgreSQL - Robust, excellent data integrity, advanced features, strong open-source community
- **Alternative:** MySQL/MariaDB - Widely known, simpler setup, adequate for requirements

**Document Generation:**
- **PDF:** PDFKit (Node.js), ReportLab (Python), or TCPDF (PHP)
- **Word:** docxtemplater (Node.js), python-docx (Python), or PHPWord (PHP)

**Email Notifications (Optional):**
- Local SMTP server integration using Nodemailer, smtplib, or PHPMailer
- Email queue for reliability
- Fallback to in-app notifications if SMTP unavailable

**Authentication:**
- Built-in authentication system (no OAuth/LDAP in Phase 1)
- bcrypt for password hashing
- JWT tokens for session management
- Password reset via admin-assisted process (no email-based reset in Phase 1)

**Deployment:**
- Docker containers (optional) for easier deployment and updates
- Systemd services for process management on Linux
- Windows Service wrapper for Windows Server deployment
- Nginx reverse proxy for production deployment
- Database migration scripts for schema updates

**Development Environment:**
- Git for version control
- Environment-based configuration (.env files)
- Development seed data scripts
- Local development setup documentation

**Compliance & Security:**
- Input validation library (Joi, Yup, or similar)
- SQL query parameterization (ORM or prepared statements)
- CSRF token implementation
- Rate limiting for API endpoints
- Audit logging middleware capturing all database modifications

**Philippine-Specific Requirements:**
- Philippine holiday calendar data (JSON/database table)
- CSC leave calculation rules engine (configurable)
- Philippine Standard Time (PST/UTC+8) timezone handling
- Philippine English spell-check dictionary for forms

---

## Epic List

**Epic 1: Foundation & Authentication**  
*Goal:* Establish project infrastructure, database foundation, and secure user authentication system with role-based access control.

**Epic 2: Employee Management & Core Data**  
*Goal:* Enable HR administrators to manage employee records, departments, and organizational structure with bulk import capabilities.

**Epic 3: Pass Slip Management**  
*Goal:* Digitize pass slip workflows with request submission, multi-level approvals, and comprehensive tracking.

**Epic 4: Leave Management System**  
*Goal:* Implement complete leave management including all CSC leave types, automated credit accrual, approval workflows, and balance tracking.

**Epic 5: Certificate Generation**  
*Goal:* Automate generation of Philippine government certificates with template management and digital signatures.

**Epic 6: Reporting & Analytics**
*Goal:* Provide comprehensive reporting capabilities for all modules with CSC-compliant formats and audit trail access.

---

## Epic 1: Foundation & Authentication

**Expanded Goal:** Establish the complete project infrastructure including repository setup, database schema, development environment, and production-ready authentication system with role-based access control. This epic delivers a deployable application with secure login, user management, and the foundational architecture that all subsequent modules will build upon.

### Story 1.1: Project Setup & Development Environment

As a **developer**,
I want **a fully configured project repository with development environment setup**,
so that **I can begin building features with proper tooling, version control, and deployment infrastructure in place**.

**Acceptance Criteria:**
1. Repository initialized with appropriate .gitignore for chosen technology stack
2. README.md includes project overview, setup instructions, and technology stack documentation
3. Package manager configuration file (package.json, requirements.txt, composer.json) with initial dependencies
4. Environment configuration system (.env.example file with all required variables documented)
5. Database connection configuration with environment-based settings
6. Development server runs successfully on localhost with hot-reload capability
7. Basic project structure created with folders for: routes/controllers, models, services, middleware, config, tests
8. Logging framework configured with appropriate log levels (debug, info, warn, error)
9. Error handling middleware captures and logs all unhandled errors
10. Health check endpoint (/api/health) returns 200 OK with system status

### Story 1.2: Database Schema Foundation

As a **developer**,
I want **a complete normalized database schema with all tables, relationships, and constraints**,
so that **the data model supports all HRMS modules with referential integrity and proper indexing**.

**Acceptance Criteria:**
1. Database migration scripts create all required tables: users, employees, departments, roles, permissions, role_permissions, user_roles, pass_slips, leave_types, leave_requests, leave_balances, leave_credits, certificates, approval_workflows, audit_logs, system_config, holidays
2. All tables include standard fields: id (primary key), created_at, updated_at, created_by, updated_by
3. Foreign key constraints established with appropriate CASCADE/RESTRICT rules
4. Indexes created on frequently queried columns (employee_id, department_id, status, dates)
5. Unique constraints applied where appropriate (username, employee_id)
6. Check constraints enforce data validity (e.g., time_out < time_in, leave_balance >= 0)
7. Database migration rollback scripts provided for all migrations
8. Entity-Relationship Diagram (ERD) generated and saved to docs/database-erd.png
9. Database seed script creates initial data: admin user, default roles (Employee, Supervisor, HR Admin, System Admin), Philippine holidays for current year
10. Database connection pool configured with appropriate limits

### Story 1.3: User Authentication System

As a **system user**,
I want **to securely log in with username and password**,
so that **I can access the HRMS system with my assigned role and permissions**.

**Acceptance Criteria:**
1. Login page displays username and password fields with "Remember Me" checkbox
2. POST /api/auth/login endpoint accepts username and password, validates credentials
3. Passwords hashed using bcrypt with appropriate salt rounds (minimum 10)
4. Successful login returns JWT token with user ID, username, and roles encoded
5. JWT token expires after 8 hours (configurable)
6. Failed login returns 401 Unauthorized with generic error message (no username/password hints)
7. Account locks after 5 consecutive failed login attempts within 15 minutes
8. Locked accounts display message: "Account locked. Contact system administrator."
9. Session management stores active sessions with user ID, login time, IP address, user agent
10. Logout endpoint (/api/auth/logout) invalidates JWT token and clears session
11. Authentication middleware validates JWT token on all protected routes
12. Expired or invalid tokens return 401 with redirect to login page

### Story 1.4: Role-Based Access Control (RBAC)

As a **system administrator**,
I want **a role-based access control system that restricts features based on user roles**,
so that **users can only access functionality appropriate to their position and responsibilities**.

**Acceptance Criteria:**
1. Four roles defined in database: Employee, Supervisor, HR Administrator, System Administrator
2. Permissions defined for each module: pass_slip.create, pass_slip.approve, leave.create, leave.approve, employee.read, employee.write, certificate.generate, reports.view, system.admin
3. Role-permission mappings established:
   - Employee: pass_slip.create, leave.create, employee.read (own record only)
   - Supervisor: All Employee permissions + pass_slip.approve, leave.approve (department only), employee.read (department only)
   - HR Administrator: All Supervisor permissions + employee.write, certificate.generate, reports.view (all)
   - System Administrator: All permissions
4. Authorization middleware checks user permissions before allowing access to protected routes
5. Frontend UI conditionally renders menu items and buttons based on user role
6. API endpoints return 403 Forbidden when user lacks required permission
7. Users can be assigned multiple roles (e.g., Supervisor + HR Administrator)
8. Permission checks log denied access attempts to audit log
9. GET /api/auth/me endpoint returns current user profile with roles and permissions
10. Role changes take effect on next login (no real-time permission updates required)

### Story 1.5: User Management Interface

As a **system administrator**,
I want **to create, modify, and deactivate user accounts with role assignments**,
so that **I can manage system access for all employees**.

**Acceptance Criteria:**
1. User management page displays searchable, sortable table of all users with columns: username, full name, roles, status (active/inactive), last login
2. "Add User" button opens modal form with fields: username, full name, email, employee_id (dropdown), initial password, confirm password, roles (multi-select checkboxes)
3. POST /api/users endpoint creates new user with validation: username unique, password meets complexity requirements (8+ chars, uppercase, lowercase, number, special char), employee_id exists
4. "Edit User" button opens modal pre-populated with user data, allows modification of: full name, email, roles, status
5. PUT /api/users/:id endpoint updates user with validation
6. "Deactivate User" button changes user status to inactive (soft delete, no data deletion)
7. Inactive users cannot log in, receive message: "Account deactivated. Contact system administrator."
8. "Reset Password" button generates temporary password, displays to admin (no email sent)
9. User must change temporary password on first login
10. All user management actions logged to audit log with admin user attribution
11. Search functionality filters users by username, full name, or employee ID
12. Pagination displays 25 users per page with page navigation

### Story 1.6: Password Management

As an **employee**,
I want **to change my password and be required to update it periodically**,
so that **my account remains secure according to government cybersecurity standards**.

**Acceptance Criteria:**
1. "Change Password" link in user profile menu navigates to password change page
2. Password change form displays fields: current password, new password, confirm new password
3. PUT /api/auth/change-password endpoint validates current password, checks new password complexity
4. Password complexity requirements enforced: minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
5. New password cannot match any of last 3 passwords (password history stored as hashes)
6. Successful password change logs user out, requires re-login with new password
7. Password expiration set to 90 days (configurable in system_config table)
8. Users receive warning message 7 days before password expiration: "Your password expires in X days. Please change it."
9. Expired passwords force password change on next login before accessing system
10. Password change action logged to audit log
11. Failed password change attempts (wrong current password) logged and count toward account lockout threshold

---

## Epic 2: Employee Management & Core Data

**Expanded Goal:** Enable HR administrators to manage the complete employee database including personal information, employment details, departmental structure, and organizational hierarchy. This epic delivers bulk import capabilities for initial data migration and establishes the employee data foundation required by all HR modules (pass slips, leave, certificates).

### Story 2.1: Department Management

As an **HR administrator**,
I want **to create and manage departments with hierarchical structure**,
so that **the system accurately reflects our office's organizational structure for approval routing and reporting**.

**Acceptance Criteria:**
1. Departments page displays tree view of all departments with expand/collapse functionality
2. "Add Department" button opens form with fields: department name, parent department (dropdown, optional for top-level), department head (employee dropdown, optional)
3. POST /api/departments endpoint creates department with validation: name required and unique within parent
4. Department hierarchy supports unlimited nesting levels (e.g., Office → Division → Section → Unit)
5. "Edit Department" button allows modification of department name, parent, and department head
6. PUT /api/departments/:id endpoint updates department, prevents circular references (department cannot be its own ancestor)
7. "Delete Department" button soft-deletes department only if no employees assigned
8. Departments with employees display warning: "Cannot delete department with assigned employees. Reassign employees first."
9. Department tree view displays employee count per department
10. Department changes logged to audit log

### Story 2.2: Employee Profile Management

As an **HR administrator**,
I want **to create and maintain comprehensive employee records**,
so that **all employee information is centralized and available for HR operations**.

**Acceptance Criteria:**
1. Employees page displays searchable, filterable table with columns: employee ID, full name, position, department, employment status, actions
2. "Add Employee" button opens multi-tab form with sections: Personal Information, Employment Details, Contact Information
3. Personal Information tab fields: employee ID (auto-generated or manual), first name, middle name, last name, suffix, date of birth, gender, civil status
4. Employment Details tab fields: position/title, salary grade, department (dropdown), employment status (Regular, Casual, Contractual, Co-terminus), date hired, date regularized (optional)
5. Contact Information tab fields: email, mobile number, address (street, barangay, city, province, postal code)
6. POST /api/employees endpoint creates employee with validation: employee ID unique, required fields present, date hired <= current date
7. Employee ID format configurable (e.g., YYYY-NNNN where YYYY is year, NNNN is sequence)
8. "Edit Employee" button opens form pre-populated with employee data, allows modification of all fields
9. PUT /api/employees/:id endpoint updates employee with validation
10. "View Employee" button displays read-only profile with all information and employment history
11. Employment status change (e.g., Casual to Regular) creates audit trail entry
12. Search functionality filters by employee ID, name, position, or department
13. Filter dropdowns for: department, employment status, salary grade
14. All employee actions logged to audit log

### Story 2.3: Employee Bulk Import

As an **HR administrator**,
I want **to import employee data from CSV/Excel files**,
so that **I can quickly populate the system with existing employee records without manual entry**.

**Acceptance Criteria:**
1. "Import Employees" button on employees page opens import wizard
2. Step 1: Download CSV template with headers: employee_id, first_name, middle_name, last_name, suffix, date_of_birth, gender, civil_status, position, salary_grade, department_name, employment_status, date_hired, date_regularized, email, mobile, address_street, address_barangay, address_city, address_province, address_postal_code
3. Step 2: File upload accepts .csv and .xlsx files (max 5MB)
4. Step 3: Data validation displays preview table with validation results per row
5. Validation checks: employee_id unique, required fields present, date formats valid (YYYY-MM-DD), department exists, email format valid, mobile format valid (Philippine format)
6. Invalid rows highlighted in red with error messages, valid rows in green
7. "Fix Errors" option allows inline editing of invalid data
8. "Import Valid Rows" button imports only validated rows, skips invalid rows
9. POST /api/employees/import endpoint processes validated data, creates employee records
10. Import summary displays: total rows, successful imports, failed imports, error log downloadable
11. All imported employees receive default password (configurable, e.g., "Welcome2024!") and must change on first login
12. User accounts automatically created for imported employees with Employee role
13. Import action logged to audit log with file name, row count, and admin user

### Story 2.4: Employee Search and Filtering

As a **supervisor**,
I want **to quickly find employee records using search and filters**,
so that **I can access employee information efficiently when processing approvals or generating reports**.

**Acceptance Criteria:**
1. Search bar on employees page accepts text input, searches across: employee ID, first name, last name, position
2. Search executes on Enter key or "Search" button click
3. Search results display in real-time (debounced after 300ms of typing)
4. Advanced filters panel includes: department (multi-select dropdown), employment status (multi-select), salary grade (range slider), date hired (date range picker)
5. "Apply Filters" button refreshes table with filtered results
6. "Clear Filters" button resets all filters and search
7. Filter state persists in URL query parameters (shareable filtered view)
8. Filtered results display count: "Showing X of Y employees"
9. Export filtered results to CSV via "Export" button
10. GET /api/employees endpoint supports query parameters: search, department_ids, employment_statuses, salary_grade_min, salary_grade_max, date_hired_from, date_hired_to
11. Supervisors see only employees in their department(s), HR admins see all employees
12. Search and filter actions do not require audit logging (read-only operations)

### Story 2.5: Philippine Holiday Calendar Management

As an **HR administrator**,
I want **to manage the Philippine holiday calendar**,
so that **leave calculations and working day computations exclude official holidays**.

**Acceptance Criteria:**
1. Holidays page displays calendar view of current year with holidays marked
2. Table view lists all holidays with columns: date, holiday name, type (Regular, Special Non-Working), recurring (Yes/No)
3. "Add Holiday" button opens form with fields: date (date picker), holiday name, type (dropdown), recurring (checkbox)
4. POST /api/holidays endpoint creates holiday with validation: date required, name required
5. Recurring holidays (e.g., New Year's Day, Independence Day) automatically created for next 5 years
6. "Edit Holiday" button allows modification of holiday name and type (date not editable for past holidays)
7. "Delete Holiday" button removes holiday (only future holidays deletable)
8. System pre-populated with Philippine regular holidays: New Year's Day, Maundy Thursday, Good Friday, Araw ng Kagitingan, Labor Day, Independence Day, National Heroes Day, Bonifacio Day, Christmas Day, Rizal Day
9. "Import Holidays" button accepts CSV with columns: date, name, type, recurring
10. Holiday calendar used by leave calculation engine to compute working days
11. GET /api/holidays endpoint returns holidays for specified year
12. Holiday changes logged to audit log

---

## Epic 3: Pass Slip Management

**Expanded Goal:** Digitize the complete pass slip workflow enabling employees to request temporary leave from office premises, supervisors to approve/deny requests through configurable multi-level workflows, and administrators to track all pass slip activity with comprehensive audit trails. This epic delivers the first operational HR module with end-to-end functionality from request submission to approval and reporting.

### Story 3.1: Pass Slip Request Submission

As an **employee**,
I want **to submit a pass slip request digitally**,
so that **I can request permission to leave the office temporarily without paper forms**.

**Acceptance Criteria:**
1. "Request Pass Slip" button on employee dashboard navigates to pass slip request form
2. Form displays fields: pass slip type (dropdown: Planned, Emergency), destination, reason for leaving, date (date picker, default today), time out (time picker), expected time in (time picker)
3. Form validation: all fields required, time out < expected time in, date >= today
4. Employee information auto-populated: employee name, employee ID, department (read-only)
5. "Submit" button sends POST /api/pass-slips request
6. Successful submission displays confirmation message with pass slip reference number
7. Pass slip status set to "Pending" on creation
8. Approval workflow automatically determined based on employee's department and pass slip type
9. Email/in-app notification sent to first approver in workflow
10. Submitted pass slip appears in employee's "My Pass Slips" list with status "Pending"
11. Pass slip creation logged to audit log with employee ID, timestamp, and all field values
12. "Cancel Request" button available for pending pass slips (status changes to "Cancelled")

### Story 3.2: Pass Slip Approval Workflow

As a **supervisor**,
I want **to review and approve/deny pass slip requests from my department**,
so that **I can authorize employee absences and maintain accountability**.

**Acceptance Criteria:**
1. Supervisor dashboard displays "Pending Approvals" widget with count of pass slips awaiting approval
2. "Pending Pass Slips" page lists all pass slips requiring supervisor's approval with columns: employee name, destination, reason, time out, expected time in, date requested
3. "View Details" button opens pass slip detail modal showing all information
4. "Approve" button changes pass slip status to "Approved", records approver name and timestamp
5. "Deny" button opens comment modal requiring denial reason (minimum 10 characters)
6. Denied pass slips status set to "Denied", denial reason stored
7. PUT /api/pass-slips/:id/approve endpoint updates status, validates supervisor has approval permission for employee's department
8. PUT /api/pass-slips/:id/deny endpoint updates status with denial reason
9. Email/in-app notification sent to employee on approval/denial
10. Multi-level approval: if workflow requires multiple approvers, status changes to "Pending" for next approver after first approval
11. Final approval changes status to "Approved", no further approvals needed
12. Approval/denial actions logged to audit log with approver ID, timestamp, action, and comments
13. Approved pass slips appear in employee's dashboard with "Approved" badge

### Story 3.3: Pass Slip Time Tracking

As an **employee**,
I want **to record my actual return time when I come back to the office**,
so that **my pass slip record is complete and accurate**.

**Acceptance Criteria:**
1. Approved pass slips display "Record Return" button when current time >= time out
2. "Record Return" button opens modal with actual time in (time picker, default current time)
3. PUT /api/pass-slips/:id/return endpoint updates actual_time_in field
4. Actual time in must be >= time out (validation)
5. Pass slip status changes to "Completed" after return time recorded
6. Overdue pass slips (current time > expected time in + 30 minutes, no return recorded) flagged with "Overdue" badge
7. Overdue pass slips appear in supervisor's dashboard with alert icon
8. Supervisor can record return time on behalf of employee if needed
9. Return time recording logged to audit log
10. Completed pass slips display duration: actual time in - time out (in hours and minutes)
11. Pass slips with actual time in > expected time in + 1 hour highlighted for supervisor review

### Story 3.4: Pass Slip History and Search

As an **employee**,
I want **to view my pass slip history with search and filtering**,
so that **I can track my past requests and reference previous pass slips**.

**Acceptance Criteria:**
1. "My Pass Slips" page displays table of all employee's pass slips with columns: reference number, date, destination, time out, time in, status, approver
2. Table sorted by date descending (most recent first)
3. Status badges color-coded: Pending (yellow), Approved (green), Denied (red), Cancelled (gray), Completed (blue)
4. Search bar filters by destination or reason
5. Filter dropdowns: status (multi-select), date range (date picker)
6. "View Details" button shows complete pass slip information including approval history
7. Approval history displays: approver name, action (Approved/Denied), timestamp, comments
8. GET /api/pass-slips endpoint returns employee's pass slips with query parameters: status, date_from, date_to, search
9. Pagination displays 25 pass slips per page
10. "Export to PDF" button generates PDF report of filtered pass slips
11. Supervisors can view pass slips for their entire department via "Department Pass Slips" page
12. HR administrators can view all pass slips system-wide

### Story 3.5: Pass Slip Approval Workflow Configuration

As an **HR administrator**,
I want **to configure pass slip approval workflows per department**,
so that **approval routing matches our office's organizational hierarchy and policies**.

**Acceptance Criteria:**
1. "Approval Workflows" page under system configuration displays list of departments
2. "Configure Workflow" button per department opens workflow editor
3. Workflow editor displays: pass slip type (Planned/Emergency), approval levels (1-3 levels)
4. Each approval level specifies: approver role (Supervisor, Department Head, HR Admin), department scope (same department, parent department, any)
5. Drag-and-drop interface to reorder approval levels
6. "Add Level" button adds new approval level to workflow
7. "Remove Level" button deletes approval level
8. POST /api/workflows endpoint saves workflow configuration with validation: at least one approval level required
9. Default workflow: Planned pass slips require supervisor approval, Emergency pass slips require supervisor + HR admin approval
10. Workflow changes apply to new pass slips only (existing pass slips follow original workflow)
11. Workflow configuration changes logged to audit log
12. "Preview Workflow" button shows example approval path for sample employee

---

## Epic 4: Leave Management System

**Expanded Goal:** Implement comprehensive leave management supporting all Philippine Civil Service Commission leave types with automated credit accrual, multi-level approval workflows, real-time balance tracking, and CSC-compliant reporting. This epic delivers the core HR functionality for managing employee absences, ensuring accurate leave calculations, and maintaining compliance with government regulations.

### Story 4.1: Leave Types Configuration

As an **HR administrator**,
I want **to configure all CSC leave types with their specific rules**,
so that **the system accurately handles different leave categories according to government regulations**.

**Acceptance Criteria:**
1. "Leave Types" page under system configuration lists all leave types with columns: name, code, accrual rate, max balance, requires medical certificate, monetizable
2. System pre-populated with CSC leave types: Vacation Leave (VL), Sick Leave (SL), Maternity Leave, Paternity Leave, Special Privilege Leave (SPL), Solo Parent Leave, Study Leave
3. "Add Leave Type" button opens form with fields: leave name, leave code, accrual rate (days per month), max balance (days), requires medical certificate (checkbox), monetizable (checkbox), description
4. POST /api/leave-types endpoint creates leave type with validation: code unique, accrual rate >= 0
5. "Edit Leave Type" button allows modification of all fields except code (code immutable after creation)
6. Leave type rules: VL/SL accrue at 1.25 days/month, max balance 300 days; Maternity Leave 105 days (no accrual), Paternity Leave 7 days (no accrual), SPL 3 days/year (no accrual)
7. "Deactivate Leave Type" button soft-deletes leave type (historical records preserved)
8. Deactivated leave types not available for new requests but visible in historical data
9. Leave type configuration changes logged to audit log
10. GET /api/leave-types endpoint returns active leave types for dropdown population

### Story 4.2: Leave Credit Initialization and Accrual

As an **HR administrator**,
I want **leave credits to automatically accrue for all employees according to CSC rules**,
so that **leave balances are always accurate without manual calculation**.

**Acceptance Criteria:**
1. Leave credits initialized for all employees on system setup: VL 0 days, SL 0 days (new employees start with zero balance)
2. Monthly accrual job runs on 1st day of each month at 12:01 AM
3. Accrual calculation: employees with Regular status accrue 1.25 days VL and 1.25 days SL per month
4. Accrual prorated for partial months: employees hired mid-month accrue (days_employed / days_in_month) * 1.25
5. Accrual records created in leave_credits table with: employee_id, leave_type, amount, accrual_date, reason ("Monthly Accrual - [Month Year]")
6. Leave balances updated in leave_balances table: current_balance += accrued_amount
7. Maximum balance enforced: VL and SL cannot exceed 300 days (excess credits forfeited)
8. Accrual notification sent to employees: "Your leave credits have been updated. VL: X days, SL: Y days"
9. Manual accrual adjustment available to HR admin: "Adjust Leave Credits" button opens form with employee, leave type, amount (+/-), reason
10. POST /api/leave-credits/adjust endpoint creates manual adjustment record with HR admin attribution
11. All accrual and adjustment actions logged to audit log
12. "Leave Credits Report" shows accrual history per employee with running balance

### Story 4.3: Leave Request Submission

As an **employee**,
I want **to submit leave requests with automatic balance checking**,
so that **I can request time off and see if I have sufficient leave credits**.

**Acceptance Criteria:**
1. "Request Leave" button on employee dashboard navigates to leave request form
2. Form displays: leave type (dropdown), date from (date picker), date to (date picker), number of days (auto-calculated), reason (textarea, optional for VL, required for SL), attachment (file upload for medical certificate if required)
3. Current leave balance displayed prominently: "Your VL Balance: X days, SL Balance: Y days"
4. Date range selection auto-calculates working days (excludes weekends and Philippine holidays)
5. Half-day leave option: checkbox "Half Day", time selection (AM/PM)
6. Form validation: date from <= date to, date from >= today (or configurable advance notice period), sufficient leave balance
7. Insufficient balance displays error: "Insufficient leave credits. Required: X days, Available: Y days"
8. Conflict detection: system checks for overlapping approved leave requests, displays warning if conflict exists
9. "Submit" button sends POST /api/leave-requests request
10. Successful submission displays confirmation with leave request reference number
11. Leave request status set to "Pending", balance not deducted until approval
12. Email/in-app notification sent to first approver in workflow
13. Submitted leave request appears in employee's "My Leave Requests" list with status "Pending"
14. Leave request creation logged to audit log with all field values and attachment metadata

### Story 4.4: Leave Approval Workflow

As a **supervisor**,
I want **to review and approve/deny leave requests from my department with balance verification**,
so that **I can manage team absences while ensuring leave policy compliance**.

**Acceptance Criteria:**
1. Supervisor dashboard displays "Pending Leave Approvals" widget with count
2. "Pending Leave Requests" page lists all requests requiring approval with columns: employee name, leave type, dates, duration, reason, current balance
3. "View Details" button opens leave request detail modal showing: employee info, leave type, dates, duration, reason, attachment (if any), current balance, approval history
4. "View Attachment" button downloads medical certificate or supporting document
5. "Approve" button validates sufficient leave balance, changes status to "Approved", deducts leave credits from balance
6. "Deny" button opens comment modal requiring denial reason (minimum 10 characters)
7. PUT /api/leave-requests/:id/approve endpoint updates status, deducts credits, validates supervisor permission
8. PUT /api/leave-requests/:id/deny endpoint updates status with denial reason, no balance deduction
9. Email/in-app notification sent to employee on approval/denial
10. Multi-level approval: if workflow requires multiple approvers, status remains "Pending" for next approver
11. Final approval changes status to "Approved", credits deducted, leave appears on calendar
12. Approval/denial actions logged to audit log with approver ID, timestamp, action, comments, balance before/after
13. "Department Leave Calendar" shows approved leaves for all department employees

### Story 4.5: Leave Calendar and Conflict Management

As an **employee**,
I want **to view my leave schedule and department leave calendar**,
so that **I can plan my leave requests avoiding conflicts with team members**.

**Acceptance Criteria:**
1. "Leave Calendar" page displays monthly calendar view with employee's approved leaves highlighted
2. Leave entries color-coded by leave type: VL (blue), SL (green), Maternity (pink), Paternity (purple), SPL (orange)
3. Hover over leave entry displays tooltip: leave type, duration, status
4. "Department Calendar" tab shows all approved leaves for employee's department
5. Department calendar displays employee names on leave dates (privacy: no leave type or reason shown to peers)
6. Calendar navigation: previous/next month buttons, month/year dropdown
7. "Today" button returns to current month
8. Conflict warning displayed when submitting leave request overlapping with 50%+ of department on leave
9. Warning message: "X employees in your department are on leave during this period. Supervisor approval required."
10. GET /api/leave-requests/calendar endpoint returns leave data for specified month and department
11. Calendar view responsive: monthly view on desktop, list view on mobile
12. "Export Calendar" button generates PDF of monthly leave schedule

### Story 4.6: Leave Balance Tracking and History

As an **employee**,
I want **to view my current leave balances and complete transaction history**,
so that **I can track my leave credits, accruals, and usage accurately**.

**Acceptance Criteria:**
1. "Leave Balance" page displays current balances for all leave types in card layout: VL, SL, Maternity, Paternity, SPL, etc.
2. Each card shows: leave type name, current balance (days), used this year (days), accrued this year (days), max balance
3. Balance calculation: current_balance = opening_balance + accrued - used - adjustments
4. "Transaction History" section lists all leave credit transactions with columns: date, transaction type (Accrual/Usage/Adjustment), leave type, amount (+/-), balance after, remarks
5. Transaction types: "Monthly Accrual", "Leave Approved", "Leave Cancelled", "Manual Adjustment", "Opening Balance"
6. Transactions sorted by date descending (most recent first)
7. Filter by: leave type, transaction type, date range
8. GET /api/leave-balances/:employee_id endpoint returns current balances for all leave types
9. GET /api/leave-credits/:employee_id endpoint returns transaction history with pagination
10. "Export to Excel" button downloads balance and transaction history
11. Balance summary displays year-to-date statistics: total days taken, most used leave type, remaining balance

### Story 4.7: Leave Cancellation and Modification

As an **employee**,
I want **to cancel or modify my pending or approved leave requests**,
so that **I can adjust my plans if circumstances change**.

**Acceptance Criteria:**
1. "My Leave Requests" page displays "Cancel" button for pending and approved leave requests (not for completed or denied)
2. "Cancel Request" button opens confirmation modal: "Are you sure you want to cancel this leave request?"
3. PUT /api/leave-requests/:id/cancel endpoint changes status to "Cancelled"
4. Cancelled approved leaves restore leave credits to balance
5. Cancellation notification sent to supervisor and HR admin
6. Cancellation allowed up to 1 day before leave start date (configurable)
7. Leave requests starting tomorrow or today cannot be cancelled (must contact HR admin)
8. "Modify Request" button available for pending leave requests only (not approved)
9. Modification opens pre-populated leave request form, allows changes to dates, leave type, reason
10. PUT /api/leave-requests/:id endpoint updates leave request, resets approval workflow (requires re-approval)
11. Modification notification sent to employee: "Your leave request has been updated and requires re-approval"
12. All cancellation and modification actions logged to audit log with reason and timestamp

### Story 4.8: Leave Monetization Calculation

As an **HR administrator**,
I want **to calculate leave monetization for retiring employees per CSC rules**,
so that **I can accurately compute terminal leave pay**.

**Acceptance Criteria:**
1. "Leave Monetization" page under HR admin menu displays employee search
2. Search by employee ID or name, select employee, displays current leave balances
3. "Calculate Monetization" button opens form with fields: retirement date (date picker), daily rate (auto-populated from salary grade, editable)
4. Monetization calculation: monetizable_amount = (VL_balance + SL_balance) * daily_rate
5. CSC rules applied: maximum 300 days monetizable, unused SPL/other leaves not monetizable
6. Calculation preview displays: VL balance, SL balance, total monetizable days, daily rate, total amount
7. "Generate Report" button creates PDF report with: employee details, leave balances, calculation breakdown, total amount, authorized signatory
8. POST /api/leave-monetization endpoint saves calculation record with employee_id, retirement_date, vl_balance, sl_balance, daily_rate, total_amount, generated_by
9. Monetization report includes disclaimer: "Subject to final verification and approval by Civil Service Commission"
10. Monetization calculation logged to audit log
11. Historical monetization records viewable in "Monetization History" tab
12. "Export to Excel" button downloads monetization calculation for payroll processing

---

## Epic 5: Certificate Generation

**Expanded Goal:** Automate generation of Philippine government HR certificates using standardized templates with dynamic data population, digital signature support, and comprehensive issuance tracking. This epic delivers significant time savings (30 minutes to 2 minutes per certificate) and ensures consistency in certificate formatting and content.

### Story 5.1: Certificate Template Management

As an **HR administrator**,
I want **to create and manage certificate templates with dynamic field placeholders**,
so that **certificates are generated with consistent formatting and accurate data**.

**Acceptance Criteria:**
1. "Certificate Templates" page lists all templates with columns: template name, certificate type, last modified, actions
2. System pre-populated with templates: Certificate of Employment, Certificate of Clearance, Certificate of Leave Credits, Service Record, Certificate of No Pending Case
3. "Add Template" button opens template editor with fields: template name, certificate type, template content (rich text editor)
4. Rich text editor supports: font formatting (bold, italic, underline), alignment, line spacing, Philippine government letterhead insertion
5. Dynamic field placeholders: {{employee_name}}, {{employee_id}}, {{position}}, {{department}}, {{date_hired}}, {{salary_grade}}, {{vl_balance}}, {{sl_balance}}, {{current_date}}, {{signatory_name}}, {{signatory_title}}
6. "Insert Field" dropdown adds placeholder at cursor position
7. Template preview shows sample certificate with placeholder values filled from test employee data
8. POST /api/certificate-templates endpoint saves template with validation: template name unique, required placeholders present
9. "Edit Template" button opens editor pre-populated with template content
10. PUT /api/certificate-templates/:id endpoint updates template
11. "Duplicate Template" button creates copy of template for customization
12. Template changes logged to audit log with version history

### Story 5.2: Certificate Generation Interface

As an **HR administrator**,
I want **to generate certificates for employees with automatic data population**,
so that **I can quickly produce accurate certificates without manual typing**.

**Acceptance Criteria:**
1. "Generate Certificate" page displays: employee search, certificate type dropdown, signatory dropdown
2. Employee search by ID or name, auto-complete suggestions displayed
3. Certificate type dropdown populated from active templates
4. Signatory dropdown lists employees with HR Admin or System Admin role
5. "Preview Certificate" button generates preview with all placeholders replaced by actual employee data
6. Preview displays in modal with certificate content, letterhead, and signature placeholder
7. Data population: employee_name from employees table, vl_balance from leave_balances table, current_date formatted as "January 1, 2025"
8. "Generate PDF" button creates PDF file with certificate content
9. POST /api/certificates/generate endpoint creates certificate record and PDF file
10. PDF includes: government letterhead, certificate content, digital signature image (if configured), certificate reference number, QR code (optional)
11. Generated PDF downloadable immediately, also saved to server storage
12. "Generate Word" button creates editable .docx file for customization
13. Certificate generation logged to audit log and certificate issuance log

### Story 5.3: Digital Signature Management

As an **HR administrator**,
I want **to upload and manage digital signatures for authorized signatories**,
so that **generated certificates include official signatures without manual signing**.

**Acceptance Criteria:**
1. "Digital Signatures" page under system configuration lists all signatories with signature status (Uploaded/Not Uploaded)
2. "Upload Signature" button opens form with fields: signatory (employee dropdown), signature image (file upload), signature title (text input)
3. Signature image requirements: PNG format with transparent background, recommended size 300x100 pixels, max file size 500KB
4. POST /api/signatures endpoint uploads signature image, stores in secure directory, associates with employee record
5. Signature preview displayed after upload
6. "Replace Signature" button allows updating signature image
7. "Remove Signature" button deletes signature image (soft delete, historical certificates retain original signature)
8. Signature positioning configurable per template: X/Y coordinates, width/height
9. Certificate generation uses signatory's uploaded signature image if available
10. Certificates without digital signature display placeholder: "________________________" with signatory name below
11. Signature management actions logged to audit log
12. GET /api/signatures/:employee_id endpoint returns signature image for certificate generation
13. Signature images stored with access control (only HR admins can view/manage)

### Story 5.4: Certificate Issuance Log and Tracking

As an **HR administrator**,
I want **to maintain a complete log of all issued certificates**,
so that **I can track certificate issuances for audit and reference purposes**.

**Acceptance Criteria:**
1. "Certificate Issuance Log" page displays table of all generated certificates with columns: reference number, employee name, certificate type, issued date, issued by, status
2. Reference number format: CERT-YYYY-NNNN (e.g., CERT-2025-0001)
3. Status values: Issued, Revoked, Reissued
4. Search functionality filters by: employee name, certificate type, reference number
5. Date range filter for issued date
6. "View Certificate" button opens PDF in new tab
7. "Download Certificate" button downloads PDF file
8. "Reissue Certificate" button generates new certificate with same data, marks original as "Reissued", creates new log entry
9. "Revoke Certificate" button changes status to "Revoked", requires reason (textarea)
10. GET /api/certificates endpoint returns certificate log with pagination and filters
11. Certificate log includes: employee_id, certificate_type, template_id, signatory_id, issued_date, issued_by, file_path, reference_number, status, revocation_reason
12. "Export Log" button downloads Excel file of filtered certificate log

### Story 5.5: Batch Certificate Generation

As an **HR administrator**,
I want **to generate certificates for multiple employees simultaneously**,
so that **I can efficiently produce certificates for groups (e.g., all employees for clearance)**.

**Acceptance Criteria:**
1. "Batch Generate" button on certificate generation page opens batch interface
2. Batch interface displays: certificate type (dropdown), signatory (dropdown), employee selection method (All Employees, By Department, By Employment Status, Custom List)
3. "All Employees" option selects all active employees
4. "By Department" option displays department multi-select dropdown
5. "By Employment Status" option displays status checkboxes (Regular, Casual, Contractual)
6. "Custom List" option allows CSV upload with employee IDs or manual employee selection (multi-select list)
7. Employee preview table shows selected employees with columns: employee ID, name, position, department
8. "Remove" button per row removes employee from batch
9. "Generate Batch" button initiates batch generation process
10. POST /api/certificates/batch endpoint processes batch, generates PDF for each employee
11. Progress indicator displays: "Generating certificates... X of Y completed"
12. Batch completion displays summary: total certificates generated, successful, failed (with error details)
13. "Download All" button creates ZIP file containing all generated PDFs
14. Individual certificate download links available in results table
15. Batch generation logged to audit log with employee count, certificate type, and generated_by
16. Failed certificate generations logged with error reason (e.g., missing employee data, template error)

---

## Epic 6: Reporting & Analytics

**Expanded Goal:** Provide comprehensive reporting and analytics capabilities across all HRMS modules with CSC-compliant report formats, exportable data, and audit trail access. This epic delivers the visibility and accountability features required for government compliance, management decision-making, and operational transparency.

### Story 6.1: Dashboard Analytics

As a **system user (all roles)**,
I want **to see role-appropriate dashboard analytics and key metrics**,
so that **I can quickly understand system status and pending actions**.

**Acceptance Criteria:**
1. Employee dashboard displays widgets: My Leave Balance (VL/SL with visual gauge), Pending Requests (count), Upcoming Leaves (next 30 days), Recent Pass Slips (last 5)
2. Supervisor dashboard displays widgets: Pending Approvals (pass slips + leave requests count), Team on Leave Today (list), Department Leave Utilization (percentage), Recent Approvals (last 10)
3. HR Admin dashboard displays widgets: System Overview (total employees, active users, pending approvals), Leave Statistics (total days taken this month, most used leave type), Certificate Requests (pending/completed), Recent Activities (last 20 system actions)
4. System Admin dashboard displays widgets: All HR Admin widgets + System Health (database size, active sessions, error count), User Activity (logins today, most active users)
5. Dashboard widgets refresh automatically every 5 minutes
6. "Refresh" button manually refreshes all widgets
7. Widget data clickable: clicking "Pending Approvals" navigates to approval queue
8. GET /api/dashboard/:role endpoint returns role-specific dashboard data
9. Dashboard responsive: widgets stack vertically on mobile, grid layout on desktop
10. Date range selector for time-based widgets (default: current month)
11. Dashboard loads in < 2 seconds with lazy loading for widget data
12. "Export Dashboard" button generates PDF snapshot of current dashboard state

### Story 6.2: Pass Slip Reports

As an **HR administrator**,
I want **to generate comprehensive pass slip reports with various filters**,
so that **I can analyze pass slip usage patterns and ensure policy compliance**.

**Acceptance Criteria:**
1. "Pass Slip Reports" page displays report parameters: date range (date pickers), department (multi-select), employee (search), status (multi-select), pass slip type (Planned/Emergency)
2. "Generate Report" button creates report based on selected parameters
3. Report displays summary statistics: total pass slips, approved count, denied count, average duration, most frequent destination
4. Detailed report table columns: reference number, employee name, department, destination, date, time out, time in, duration, status, approver
5. Report sorted by date descending (most recent first)
6. "Export to PDF" button generates formatted PDF report with: report title, parameters, summary statistics, detailed table, generated date/time, generated by
7. "Export to Excel" button downloads Excel file with all report data for further analysis
8. GET /api/reports/pass-slips endpoint returns report data with query parameters
9. Report includes charts: Pass Slips by Department (bar chart), Pass Slips by Month (line chart), Pass Slip Types (pie chart)
10. Drill-down capability: clicking department in chart filters report to that department
11. Scheduled reports: option to email report monthly to specified recipients (future enhancement placeholder)
12. Report generation logged to audit log

### Story 6.3: Leave Reports and CSC Compliance

As an **HR administrator**,
I want **to generate CSC-compliant leave reports in required formats**,
so that **I can submit accurate reports to Civil Service Commission and management**.

**Acceptance Criteria:**
1. "Leave Reports" page displays report type dropdown: Monthly Leave Report, Quarterly Leave Summary, Annual Leave Statistics, Leave Balance Report, Leave Utilization Report
2. Monthly Leave Report parameters: month/year selector, department (optional)
3. Monthly Leave Report format: employee list with columns: employee ID, name, position, VL taken, SL taken, other leaves taken, VL balance, SL balance
4. Quarterly Leave Summary aggregates monthly data for 3-month period
5. Annual Leave Statistics displays: total leave days taken, average days per employee, leave type breakdown, department comparison
6. Leave Balance Report shows current balances for all employees with columns: employee ID, name, VL balance, SL balance, other leave balances, total monetizable days
7. Leave Utilization Report calculates: (days taken / days accrued) * 100% per employee and department
8. "Generate Report" button creates report with CSC-compliant formatting
9. CSC format includes: office name, reporting period, authorized signatory, submission date
10. "Export to PDF" button generates report suitable for CSC submission
11. "Export to Excel" button downloads data for internal analysis
12. GET /api/reports/leave endpoint returns report data with type and parameters
13. Report includes visualizations: Leave Utilization by Department (bar chart), Leave Trends (line chart), Leave Type Distribution (pie chart)

### Story 6.4: Certificate Issuance Reports

As an **HR administrator**,
I want **to generate reports on certificate issuances**,
so that **I can track certificate generation activity and identify trends**.

**Acceptance Criteria:**
1. "Certificate Reports" page displays parameters: date range, certificate type (multi-select), issued by (employee dropdown), status (Issued/Revoked/Reissued)
2. Report summary statistics: total certificates issued, certificates by type, most requested certificate, average processing time
3. Detailed report table columns: reference number, employee name, certificate type, issued date, issued by, status
4. "Export to PDF" button generates formatted report
5. "Export to Excel" button downloads detailed data
6. GET /api/reports/certificates endpoint returns report data
7. Report includes charts: Certificates by Type (bar chart), Certificates by Month (line chart), Certificates by Issuer (pie chart)
8. Certificate reissuance tracking: report shows original and reissued certificate reference numbers
9. Revoked certificates highlighted in red with revocation reason displayed
10. Report filterable by employee, department, or date range
11. "Certificate Volume Trend" chart shows issuance patterns over time
12. Report generation logged to audit log

### Story 6.5: Audit Log Viewer and Search

As a **system administrator**,
I want **to view and search the complete audit log of all system activities**,
so that **I can investigate issues, ensure accountability, and maintain security**.

**Acceptance Criteria:**
1. "Audit Log" page displays searchable, filterable table of all audit log entries
2. Table columns: timestamp, user, action, module (Pass Slip/Leave/Certificate/User/System), entity type, entity ID, IP address, details
3. Search functionality filters by: user (dropdown), action (dropdown), module (dropdown), date range
4. Action types: Create, Update, Delete, Approve, Deny, Login, Logout, Export, Import, Generate
5. "View Details" button opens modal showing complete audit entry: all field changes (before/after values), request payload, response status
6. Audit log entries immutable (no edit or delete capability)
7. GET /api/audit-log endpoint returns paginated audit entries with filters
8. Pagination displays 50 entries per page with page navigation
9. "Export Audit Log" button downloads filtered entries to Excel (max 10,000 rows per export)
10. Audit log retention: entries retained for minimum 3 years (configurable)
11. Audit log search performance optimized with database indexes on timestamp, user_id, module, action
12. Sensitive data (passwords, tokens) never logged in audit entries
13. Audit log viewer access restricted to System Administrator role only

### Story 6.6: Employee Reports and Analytics

As an **HR administrator**,
I want **to generate comprehensive employee reports and analytics**,
so that **I can analyze workforce data and support HR planning**.

**Acceptance Criteria:**
1. "Employee Reports" page displays report type dropdown: Employee Master List, Department Roster, Employment Status Report, Salary Grade Distribution, Service Length Report
2. Employee Master List parameters: department (multi-select), employment status (multi-select), active/inactive
3. Employee Master List columns: employee ID, full name, position, salary grade, department, employment status, date hired, years of service
4. Department Roster groups employees by department with subtotals
5. Employment Status Report shows employee count by status (Regular, Casual, Contractual, Co-terminus) with percentage distribution
6. Salary Grade Distribution displays employee count per salary grade with bar chart visualization
7. Service Length Report categorizes employees: < 1 year, 1-5 years, 5-10 years, 10-20 years, 20+ years
8. "Generate Report" button creates report based on selected type and parameters
9. "Export to PDF" button generates formatted report with charts
10. "Export to Excel" button downloads detailed data
11. GET /api/reports/employees endpoint returns report data
12. Report includes demographics: gender distribution, age distribution (if date of birth available)

---

## Checklist Results Report

### PM Checklist Validation

**✅ Goals Section**
- Clear, measurable goals defined with specific success metrics
- Goals aligned with project brief and stakeholder needs
- User adoption and training efficiency goal added for government context

**✅ Requirements Section**
- 39 Functional Requirements covering all three modules comprehensively
- 27 Non-Functional Requirements addressing performance, security, usability, deployment, scalability, and compliance
- Requirements traceable to goals and project brief
- CSC compliance requirements explicitly stated
- Zero-cost and on-premises constraints reflected in NFRs

**✅ UI Design Goals**
- Overall UX vision articulated with government-friendly design principles
- Key interaction paradigms defined (dashboard-centric, wizard-based forms, approval workflows)
- 14 core screens identified covering all user roles and workflows
- WCAG AA accessibility compliance specified
- Philippine government branding standards documented
- Target platforms clearly defined (desktop-first, mobile-friendly web)

**✅ Technical Assumptions**
- Repository structure decided: Monorepo for simplicity
- Service architecture decided: Monolithic with modular structure (appropriate for government deployment)
- Testing strategy defined: Unit + Integration with manual testing support
- Technology stack recommendations provided with rationale (Node.js/Express, Vue.js, PostgreSQL recommended)
- Philippine-specific requirements identified (holiday calendar, CSC rules, timezone)
- Deployment approach documented (Docker optional, systemd/Windows Service)

**✅ Epic Structure**
- 6 epics defined with clear sequential dependencies
- Each epic has expanded goal statement (2-3 sentences)
- Epic sequence follows logical build order: Foundation → Employee Data → Operational Modules → Reporting
- No forward dependencies between epics
- Epic scope appropriate for project size

**✅ Story Quality (35 total stories)**
- All stories follow "As a [role], I want [capability], so that [benefit]" format
- Each story includes 10-16 detailed acceptance criteria
- Acceptance criteria are specific, testable, and implementation-ready
- Stories sized appropriately for AI agent execution (2-4 hours each)
- Stories deliver vertical slices of functionality (UI + API + database)
- No forward dependencies within epics (sequential execution possible)
- Technical implementation details included in acceptance criteria
- API endpoints specified with HTTP methods
- Database operations and validation rules documented
- UI/UX requirements detailed in acceptance criteria

**✅ Completeness**
- All modules from project brief covered: Pass Slip, Leave Management, Certificate Generation
- Cross-cutting concerns addressed: Authentication, RBAC, Audit Logging, Reporting
- Philippine government context requirements integrated throughout
- CSC compliance requirements embedded in leave management stories
- Data Privacy Act compliance addressed in security NFRs

**✅ Consistency**
- Terminology consistent across all sections (employee, supervisor, HR administrator, system administrator)
- Philippine English conventions maintained
- CSC terminology used correctly (VL, SL, SPL, monetization)
- Reference number formats consistent (CERT-YYYY-NNNN pattern)
- Status values standardized (Pending, Approved, Denied, Cancelled, Completed)

**⚠️ Recommendations for Architect**
1. **Database Schema Priority**: Epic 1 Story 1.2 requires complete ERD - architect should create detailed schema with all tables, relationships, indexes, and constraints before development begins
2. **API Specification**: Consider creating OpenAPI/Swagger specification for all endpoints mentioned in acceptance criteria to ensure frontend-backend contract clarity
3. **Document Generation Architecture**: Certificate generation (Epic 5) requires careful design for template engine, PDF/Word generation, and signature image handling
4. **Leave Calculation Engine**: Leave accrual and working day calculations (Epic 4) need robust algorithm design with Philippine holiday calendar integration
5. **Approval Workflow Engine**: Configurable multi-level approval workflows (Epic 3 & 4) require flexible workflow engine design to support various organizational hierarchies

**✅ Readiness for Next Phase**
- PRD is complete and ready for handoff to Architect agent
- All information needed for architecture design is present
- Story acceptance criteria provide sufficient detail for technical design
- No blocking questions or ambiguities identified

---

## Next Steps

### For Architect Agent

**Command to proceed:** `*agent architect` then `*create-architecture`

**Architecture Document Scope:**

Create comprehensive system architecture documentation covering:

**1. System Architecture Overview**
- High-level architecture diagram (monolithic application with modular structure)
- Component interaction diagram (Web Server → Application Server → Database)
- Deployment architecture for on-premises Windows/Linux servers
- Technology stack finalization with specific versions

**2. Database Architecture**
- Complete Entity-Relationship Diagram (ERD) with all tables from Epic 1 Story 1.2
- Detailed table schemas with columns, data types, constraints, indexes
- Relationship definitions with foreign keys and cascade rules
- Database migration strategy and versioning approach
- Sample data model for testing and development

**3. API Architecture**
- RESTful API design principles and conventions
- Complete API endpoint specification for all 35 stories
- Request/response payload schemas (JSON format)
- Authentication and authorization flow (JWT token-based)
- Error handling and status code conventions
- API versioning strategy

**4. Application Architecture**
- Backend module structure (PassSlip, Leave, Certificate, User, Auth, Report modules)
- Service layer design patterns
- Business logic organization (leave calculation engine, approval workflow engine)
- Middleware architecture (authentication, authorization, logging, error handling)
- Configuration management approach (.env files, database config table)

**5. Frontend Architecture**
- Component hierarchy and organization
- State management approach (Vuex/Pinia if using Vue.js)
- Routing structure matching 14 core screens from UI Design Goals
- API integration layer (HTTP client, interceptors)
- Form validation strategy
- Responsive design breakpoints

**6. Security Architecture**
- Authentication flow diagram (login → JWT token → session management)
- Authorization model (RBAC implementation with roles and permissions)
- Password security (bcrypt hashing, complexity rules, expiration)
- Input validation and sanitization approach
- HTTPS/TLS configuration for production
- Audit logging architecture (what to log, where to store, retention policy)

**7. Document Generation Architecture**
- Template engine selection and integration
- PDF generation workflow (template → data population → PDF rendering)
- Word document generation workflow
- Digital signature image handling and positioning
- Batch generation processing approach
- File storage and retrieval strategy

**8. Leave Calculation Engine Design**
- Leave accrual algorithm (monthly accrual, proration for partial months)
- Working day calculation (excluding weekends and Philippine holidays)
- Leave balance tracking and transaction management
- Leave monetization calculation per CSC rules
- Holiday calendar integration

**9. Approval Workflow Engine Design**
- Workflow configuration data model
- Workflow execution engine (routing to approvers based on rules)
- Multi-level approval state management
- Notification triggering (email/in-app)
- Workflow modification handling

**10. Deployment Architecture**
- Server requirements and sizing recommendations
- Installation procedure outline (database setup, application deployment, web server configuration)
- Environment configuration (development, staging, production)
- Backup and recovery strategy
- Monitoring and logging approach
- Update and maintenance procedures

**Key Considerations for Architect:**
- Prioritize simplicity and maintainability for government IT staff with basic technical skills
- Ensure all components use open-source technologies (zero licensing cost)
- Design for offline operation (no internet dependency for core functionality)
- Optimize for local network deployment (low latency, high reliability)
- Include comprehensive documentation for installation and troubleshooting
- Consider future scalability to 500 employees while maintaining performance

### For UX Expert Agent (After Architecture)

**Command to proceed:** `*agent ux-expert` then `*create-ux-spec`

**UX Specification Scope:**

Create detailed front-end specifications covering:

**1. Design System**
- Color palette (Philippine government standard colors)
- Typography system (font families, sizes, weights, line heights)
- Spacing system (margins, padding, grid system)
- Component library (buttons, forms, tables, modals, cards, badges)
- Icon set selection (open-source icon library)

**2. Screen Specifications (14 Core Screens)**
- Wireframes for each screen from UI Design Goals section
- Component breakdown and hierarchy
- Interaction specifications (hover states, click actions, transitions)
- Responsive behavior (desktop, tablet, mobile breakpoints)
- Accessibility annotations (ARIA labels, keyboard navigation, focus management)

**3. User Flows**
- Pass slip request and approval flow
- Leave request and approval flow
- Certificate generation flow
- Employee onboarding flow
- Password change and reset flow

**4. Form Design**
- Form validation patterns (inline validation, error messages)
- Input field specifications (text inputs, dropdowns, date pickers, file uploads)
- Multi-step wizard design (progress indicators, navigation)
- Auto-save and draft functionality

**5. Dashboard Widgets**
- Widget layouts per role (Employee, Supervisor, HR Admin, System Admin)
- Data visualization components (charts, gauges, progress bars)
- Widget interaction patterns (drill-down, filtering, refresh)

**6. Notification System**
- In-app notification design (toast messages, notification center)
- Email notification templates (approval requests, status updates)
- Notification preferences interface

**7. Accessibility Compliance**
- WCAG AA compliance checklist
- Keyboard navigation map
- Screen reader testing scenarios
- Color contrast verification

---

## Document Completion

**PRD Status:** ✅ **COMPLETE**

**Document Statistics:**
- Total Epics: 6
- Total Stories: 35
- Total Acceptance Criteria: 420+
- Functional Requirements: 39
- Non-Functional Requirements: 27
- Core Screens Defined: 14

**Ready for:**
- ✅ Architecture design and technical specification
- ✅ UX design and front-end specification
- ✅ Development sprint planning and story assignment

**Document Location:** `docs/prd.md`

**Next Recommended Action:** Transform to Architect agent to create system architecture document.

---

*End of Product Requirements Document*

