# Philippine Government HRMS - System Architecture Document

**Document Version:** 1.0  
**Date:** 2025-10-06  
**Prepared By:** Architect (Sarah)  
**Based On:** PRD v1.0 (35 user stories across 6 epics)  
**Status:** Draft - Ready for Development

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Database Architecture](#database-architecture)
3. [API Architecture](#api-architecture)
4. [Application Architecture](#application-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Security Architecture](#security-architecture)
7. [Document Generation Architecture](#document-generation-architecture)
8. [Leave Calculation Engine](#leave-calculation-engine)
9. [Approval Workflow Engine](#approval-workflow-engine)
10. [Deployment Architecture](#deployment-architecture)
11. [Technology Stack Finalization](#technology-stack-finalization)
12. [Implementation Roadmap](#implementation-roadmap)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

**Architecture Pattern:** Monolithic Application with Modular Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Web Browser (Chrome, Firefox, Edge)                 │  │
│  │  - Desktop (Primary): 1366x768+                      │  │
│  │  - Tablet (Secondary): iPad, Android tablets         │  │
│  │  - Mobile (Tertiary): Smartphones (view-only)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Web Server (Nginx)                                  │  │
│  │  - Serves static files (HTML, CSS, JS, images)      │  │
│  │  - Reverse proxy to application server               │  │
│  │  - SSL/TLS termination                               │  │
│  │  - Request routing and load balancing                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION TIER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Application Server (Node.js/Express)                │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  API Layer (RESTful endpoints)                 │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  Middleware Layer                              │  │  │
│  │  │  - Authentication (JWT validation)             │  │  │
│  │  │  - Authorization (RBAC enforcement)            │  │  │
│  │  │  - Request logging                             │  │  │
│  │  │  - Error handling                              │  │  │
│  │  │  - Input validation                            │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  Business Logic Layer (Services)               │  │  │
│  │  │  - AuthService                                 │  │  │
│  │  │  - EmployeeService                             │  │  │
│  │  │  - PassSlipService                             │  │  │
│  │  │  - LeaveService                                │  │  │
│  │  │  - CertificateService                          │  │  │
│  │  │  - ReportService                               │  │  │
│  │  │  - WorkflowService                             │  │  │
│  │  │  - NotificationService                         │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  Data Access Layer (Repositories)              │  │  │
│  │  │  - Database query abstraction                  │  │  │
│  │  │  - Transaction management                      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database Server (PostgreSQL 14+)                    │  │
│  │  - Employee data                                     │  │
│  │  - HR transactions (pass slips, leave requests)     │  │
│  │  - System configuration                             │  │
│  │  - Audit logs                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  File Storage (Local filesystem)                     │  │
│  │  - Generated certificates (PDF/Word)                 │  │
│  │  - Digital signature images                          │  │
│  │  - Employee document attachments                     │  │
│  │  - Certificate templates                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Characteristics

**Deployment Model:** On-Premises, Single-Server or Multi-Server
- **Single-Server:** All components on one machine (suitable for 20-100 employees)
- **Multi-Server:** Web server, application server, database server separated (suitable for 100-500 employees)

**Communication Patterns:**
- **Client ↔ Web Server:** HTTPS (TLS 1.2+)
- **Web Server ↔ Application Server:** HTTP (internal network)
- **Application Server ↔ Database:** PostgreSQL wire protocol (TCP/5432)
- **Application Server ↔ File Storage:** Local filesystem I/O

**Scalability Approach:**
- **Vertical Scaling:** Increase server resources (RAM, CPU) as employee count grows
- **Horizontal Scaling:** Not required for target scale (20-500 employees)
- **Database Optimization:** Indexing, query optimization, connection pooling

**Availability Strategy:**
- **Target Uptime:** 99.5% during business hours (8 AM - 5 PM, Monday-Friday)
- **Backup Strategy:** Daily automated database backups, weekly full system backups
- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 24 hours

### 1.3 Technology Stack Decision

**Final Technology Stack:**

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Backend Framework** | Node.js + Express.js | Node 18 LTS, Express 4.18+ | Lightweight, excellent ecosystem, JavaScript full-stack consistency, easy for government IT staff to maintain |
| **Frontend Framework** | Vue.js 3 | 3.3+ | Gentle learning curve, excellent documentation, composition API for maintainability, suitable for government IT staff |
| **Database** | PostgreSQL | 14+ | Robust ACID compliance, excellent data integrity, advanced features (JSON, full-text search), strong open-source community |
| **ORM/Query Builder** | Knex.js | 2.5+ | Flexible query builder, migration support, works well with PostgreSQL, simpler than full ORM |
| **Authentication** | jsonwebtoken + bcrypt | jwt 9.0+, bcrypt 5.1+ | Industry-standard JWT tokens, secure password hashing |
| **PDF Generation** | PDFKit | 0.13+ | Pure JavaScript, no external dependencies, flexible layout control |
| **Word Generation** | docxtemplater | 3.40+ | Template-based Word generation, supports placeholders and dynamic content |
| **File Upload** | Multer | 1.4+ | Express middleware for multipart/form-data, handles file uploads |
| **Validation** | Joi | 17.10+ | Schema-based validation, clear error messages, comprehensive rule set |
| **Email (Optional)** | Nodemailer | 6.9+ | SMTP client for email notifications, fallback to in-app notifications |
| **Task Scheduling** | node-cron | 3.0+ | Cron-like job scheduler for leave accrual automation |
| **Web Server** | Nginx | 1.24+ | High-performance reverse proxy, static file serving, SSL termination |
| **Process Manager** | PM2 | 5.3+ | Production process manager, auto-restart, log management |

**Development Tools:**
- **Version Control:** Git
- **Package Manager:** npm (bundled with Node.js)
- **Testing Framework:** Jest (unit tests), Supertest (API integration tests)
- **Code Linting:** ESLint
- **Code Formatting:** Prettier
- **API Documentation:** Swagger/OpenAPI (optional)

### 1.4 Project Structure (Monorepo)

```
hrms/
├── backend/                      # Node.js/Express application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.js      # Database connection config
│   │   │   ├── auth.js          # JWT secret, token expiry
│   │   │   └── app.js           # Application settings
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── authorize.js     # RBAC authorization
│   │   │   ├── validate.js      # Request validation
│   │   │   ├── errorHandler.js  # Global error handler
│   │   │   └── auditLog.js      # Audit logging
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── passSlip.routes.js
│   │   │   ├── leave.routes.js
│   │   │   ├── certificate.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── index.js         # Route aggregator
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── passSlip.controller.js
│   │   │   ├── leave.controller.js
│   │   │   ├── certificate.controller.js
│   │   │   └── report.controller.js
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── employee.service.js
│   │   │   ├── passSlip.service.js
│   │   │   ├── leave.service.js
│   │   │   ├── leaveCalculation.service.js
│   │   │   ├── certificate.service.js
│   │   │   ├── workflow.service.js
│   │   │   ├── notification.service.js
│   │   │   └── report.service.js
│   │   ├── repositories/        # Data access layer
│   │   │   ├── user.repository.js
│   │   │   ├── employee.repository.js
│   │   │   ├── passSlip.repository.js
│   │   │   ├── leave.repository.js
│   │   │   └── certificate.repository.js
│   │   ├── models/              # Data models (if using ORM)
│   │   ├── utils/               # Utility functions
│   │   │   ├── dateUtils.js     # Working day calculations
│   │   │   ├── pdfGenerator.js  # PDF generation utilities
│   │   │   ├── wordGenerator.js # Word generation utilities
│   │   │   └── validators.js    # Custom validators
│   │   ├── jobs/                # Scheduled jobs
│   │   │   └── leaveAccrual.job.js
│   │   └── app.js               # Express app setup
│   ├── migrations/              # Database migrations
│   ├── seeds/                   # Database seed data
│   ├── tests/                   # Test files
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Application entry point
├── frontend/                     # Vue.js application
│   ├── public/                  # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/              # Images, fonts, styles
│   │   ├── components/          # Reusable Vue components
│   │   │   ├── common/          # Shared components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── employee/        # Employee management components
│   │   │   ├── passSlip/        # Pass slip components
│   │   │   ├── leave/           # Leave management components
│   │   │   ├── certificate/     # Certificate components
│   │   │   └── report/          # Report components
│   │   ├── views/               # Page-level components
│   │   │   ├── Login.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── EmployeeDashboard.vue
│   │   │   ├── SupervisorDashboard.vue
│   │   │   ├── HRAdminDashboard.vue
│   │   │   └── ...
│   │   ├── router/              # Vue Router configuration
│   │   │   └── index.js
│   │   ├── store/               # Pinia state management
│   │   │   ├── auth.js
│   │   │   ├── employee.js
│   │   │   ├── passSlip.js
│   │   │   ├── leave.js
│   │   │   └── index.js
│   │   ├── services/            # API service layer
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── auth.service.js
│   │   │   ├── employee.service.js
│   │   │   ├── passSlip.service.js
│   │   │   ├── leave.service.js
│   │   │   └── certificate.service.js
│   │   ├── utils/               # Utility functions
│   │   ├── App.vue              # Root component
│   │   └── main.js              # Application entry point
│   ├── package.json
│   └── vite.config.js           # Vite build configuration
├── docs/                         # Documentation
│   ├── project-brief.md
│   ├── prd.md
│   ├── architecture.md          # This document
│   ├── api-specification.md     # Detailed API docs
│   ├── database-erd.png         # Database diagram
│   ├── installation-guide.md
│   └── user-manual.md
├── storage/                      # File storage directory
│   ├── certificates/            # Generated certificates
│   ├── signatures/              # Digital signature images
│   ├── attachments/             # Document attachments
│   └── templates/               # Certificate templates
├── .gitignore
├── README.md
└── docker-compose.yml           # Optional Docker setup

```

---

## 2. Database Architecture

### 2.1 Entity-Relationship Diagram (ERD)

**Database Management System:** PostgreSQL 14+

**ERD Overview:**

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│     users       │────────>│   user_roles     │<────────│     roles       │
│                 │  1:N    │                  │  N:1    │                 │
│ • id (PK)       │         │ • user_id (FK)   │         │ • id (PK)       │
│ • username      │         │ • role_id (FK)   │         │ • name          │
│ • password_hash │         └──────────────────┘         │ • description   │
│ • employee_id   │──┐                                    └─────────────────┘
│ • status        │  │                                             │
│ • last_login    │  │                                             │ 1:N
└─────────────────┘  │                                             ↓
                     │                                    ┌─────────────────┐
                     │                                    │ role_permissions│
                     │                                    │                 │
                     │                                    │ • role_id (FK)  │
                     │                                    │ • permission    │
                     │                                    └─────────────────┘
                     │ 1:1
                     ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                            employees                                     │
│                                                                          │
│ • id (PK)                    • employment_status      • created_at      │
│ • employee_id (UNIQUE)       • date_hired             • updated_at      │
│ • first_name                 • date_regularized       • created_by      │
│ • middle_name                • department_id (FK)     • updated_by      │
│ • last_name                  • email                                    │
│ • suffix                     • mobile                                   │
│ • date_of_birth              • address_street                           │
│ • gender                     • address_barangay                         │
│ • civil_status               • address_city                             │
│ • position                   • address_province                         │
│ • salary_grade               • address_postal_code                      │
└─────────────────────────────────────────────────────────────────────────┘
         │                                    ↑
         │ N:1                                │ 1:N
         ↓                                    │
┌─────────────────┐                  ┌─────────────────┐
│  departments    │                  │   pass_slips    │
│                 │                  │                 │
│ • id (PK)       │                  │ • id (PK)       │
│ • name          │                  │ • employee_id   │
│ • parent_id (FK)│                  │ • reference_no  │
│ • dept_head_id  │                  │ • pass_slip_type│
└─────────────────┘                  │ • destination   │
                                     │ • reason        │
                                     │ • date          │
                                     │ • time_out      │
                                     │ • expected_in   │
                                     │ • actual_in     │
                                     │ • status        │
                                     │ • created_at    │
                                     └─────────────────┘
                                              │
                                              │ 1:N
                                              ↓
                                     ┌─────────────────┐
                                     │   approvals     │
                                     │                 │
                                     │ • id (PK)       │
                                     │ • entity_type   │
                                     │ • entity_id     │
                                     │ • approver_id   │
                                     │ • action        │
                                     │ • comments      │
                                     │ • approved_at   │
                                     └─────────────────┘

┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  leave_types    │<────────│ leave_requests   │────────>│   employees     │
│                 │  N:1    │                  │  N:1    │                 │
│ • id (PK)       │         │ • id (PK)        │         └─────────────────┘
│ • name          │         │ • employee_id    │
│ • code          │         │ • leave_type_id  │
│ • accrual_rate  │         │ • reference_no   │
│ • max_balance   │         │ • date_from      │
│ • requires_cert │         │ • date_to        │
│ • monetizable   │         │ • num_days       │
│ • description   │         │ • is_half_day    │
└─────────────────┘         │ • reason         │
                            │ • attachment_path│
                            │ • status         │
                            │ • created_at     │
                            └──────────────────┘
                                     │
                                     │ 1:N
                                     ↓
                            ┌──────────────────┐
                            │   approvals      │
                            │  (shared table)  │
                            └──────────────────┘

┌─────────────────┐         ┌──────────────────┐
│  leave_types    │<────────│ leave_balances   │────────>┌─────────────────┐
│                 │  N:1    │                  │  N:1    │   employees     │
└─────────────────┘         │ • id (PK)        │         └─────────────────┘
                            │ • employee_id    │
                            │ • leave_type_id  │
                            │ • current_balance│
                            │ • updated_at     │
                            └──────────────────┘

┌─────────────────┐         ┌──────────────────┐
│  leave_types    │<────────│  leave_credits   │────────>┌─────────────────┐
│                 │  N:1    │                  │  N:1    │   employees     │
└─────────────────┘         │ • id (PK)        │         └─────────────────┘
                            │ • employee_id    │
                            │ • leave_type_id  │
                            │ • amount         │
                            │ • transaction_type│
                            │ • reason         │
                            │ • balance_after  │
                            │ • created_at     │
                            │ • created_by     │
                            └──────────────────┘

┌──────────────────────┐         ┌──────────────────┐
│ certificate_templates│<────────│   certificates   │────────>┌─────────────┐
│                      │  N:1    │                  │  N:1    │  employees  │
│ • id (PK)            │         │ • id (PK)        │         └─────────────┘
│ • name               │         │ • employee_id    │
│ • certificate_type   │         │ • template_id    │
│ • template_content   │         │ • reference_no   │
│ • placeholders       │         │ • signatory_id   │
│ • created_at         │         │ • file_path_pdf  │
│ • updated_at         │         │ • file_path_word │
└──────────────────────┘         │ • status         │
                                 │ • issued_date    │
                                 │ • issued_by      │
                                 │ • revocation_reason│
                                 └──────────────────┘

┌─────────────────┐
│digital_signatures│────────>┌─────────────────┐
│                 │  N:1    │   employees     │
│ • id (PK)       │         │  (signatory)    │
│ • employee_id   │         └─────────────────┘
│ • signature_path│
│ • signature_title│
│ • uploaded_at   │
└─────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   departments    │<────────│approval_workflows│
│                  │  N:1    │                  │
└──────────────────┘         │ • id (PK)        │
                             │ • department_id  │
                             │ • entity_type    │
                             │ • workflow_config│
                             │ • created_at     │
                             │ • updated_at     │
                             └──────────────────┘

┌─────────────────┐
│    holidays     │
│                 │
│ • id (PK)       │
│ • date          │
│ • name          │
│ • type          │
│ • recurring     │
└─────────────────┘

┌─────────────────┐
│  system_config  │
│                 │
│ • id (PK)       │
│ • config_key    │
│ • config_value  │
│ • description   │
│ • updated_at    │
└─────────────────┘

┌─────────────────┐
│   audit_logs    │
│                 │
│ • id (PK)       │
│ • user_id       │
│ • action        │
│ • module        │
│ • entity_type   │
│ • entity_id     │
│ • details       │
│ • ip_address    │
│ • user_agent    │
│ • created_at    │
└─────────────────┘

┌─────────────────┐
│    sessions     │
│                 │
│ • id (PK)       │
│ • user_id       │
│ • token         │
│ • ip_address    │
│ • user_agent    │
│ • expires_at    │
│ • created_at    │
└─────────────────┘
```

### 2.2 Detailed Table Schemas

#### 2.2.1 Authentication & Authorization Tables

**Table: users**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_id INTEGER UNIQUE REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'locked'
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_expires_at TIMESTAMP,
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_status ON users(status);
```

**Table: roles**
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Employee', 'Supervisor', 'HR Administrator', 'System Administrator'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO roles (name, description) VALUES
('Employee', 'Basic employee access - can submit pass slips and leave requests'),
('Supervisor', 'Department supervisor - can approve requests for department employees'),
('HR Administrator', 'HR admin - full access to employee management and certificate generation'),
('System Administrator', 'System admin - full system access including user management and configuration');
```

**Table: user_roles**
```sql
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

**Table: role_permissions**
```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL, -- e.g., 'pass_slip.create', 'leave.approve', 'employee.write'
    PRIMARY KEY (role_id, permission)
);

-- Seed data for permissions
INSERT INTO role_permissions (role_id, permission) VALUES
-- Employee permissions
(1, 'pass_slip.create'), (1, 'pass_slip.read_own'), (1, 'leave.create'), (1, 'leave.read_own'), (1, 'employee.read_own'),
-- Supervisor permissions (includes all Employee permissions)
(2, 'pass_slip.create'), (2, 'pass_slip.read_own'), (2, 'pass_slip.read_department'), (2, 'pass_slip.approve'),
(2, 'leave.create'), (2, 'leave.read_own'), (2, 'leave.read_department'), (2, 'leave.approve'),
(2, 'employee.read_own'), (2, 'employee.read_department'),
-- HR Administrator permissions (includes all Supervisor permissions)
(3, 'pass_slip.create'), (3, 'pass_slip.read_all'), (3, 'pass_slip.approve'),
(3, 'leave.create'), (3, 'leave.read_all'), (3, 'leave.approve'),
(3, 'employee.read_all'), (3, 'employee.write'), (3, 'employee.import'),
(3, 'certificate.generate'), (3, 'certificate.read_all'),
(3, 'report.view_all'), (3, 'workflow.configure'),
-- System Administrator permissions (all permissions)
(4, 'system.admin'), (4, 'user.manage'), (4, 'audit.view');
```

**Table: sessions**
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### 2.2.2 Employee & Department Tables

**Table: departments**
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    dept_head_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    CONSTRAINT chk_no_self_parent CHECK (id != parent_id)
);

CREATE INDEX idx_departments_parent_id ON departments(parent_id);
CREATE INDEX idx_departments_dept_head_id ON departments(dept_head_id);
```

**Table: employees**
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(10),
    date_of_birth DATE,
    gender VARCHAR(10), -- 'Male', 'Female'
    civil_status VARCHAR(20), -- 'Single', 'Married', 'Widowed', 'Separated'
    position VARCHAR(100) NOT NULL,
    salary_grade VARCHAR(20),
    employment_status VARCHAR(30) NOT NULL, -- 'Regular', 'Casual', 'Contractual', 'Co-terminus'
    date_hired DATE NOT NULL,
    date_regularized DATE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    email VARCHAR(100),
    mobile VARCHAR(20),
    address_street VARCHAR(200),
    address_barangay VARCHAR(100),
    address_city VARCHAR(100),
    address_province VARCHAR(100),
    address_postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_employment_status ON employees(employment_status);
CREATE INDEX idx_employees_last_name ON employees(last_name);
CREATE INDEX idx_employees_date_hired ON employees(date_hired);
```

#### 2.2.3 Pass Slip Tables

**Table: pass_slips**
```sql
CREATE TABLE pass_slips (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(30) UNIQUE NOT NULL, -- Format: PS-YYYY-NNNN
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pass_slip_type VARCHAR(20) NOT NULL, -- 'Planned', 'Emergency'
    destination VARCHAR(200) NOT NULL,
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    time_out TIME NOT NULL,
    expected_time_in TIME NOT NULL,
    actual_time_in TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Denied', 'Cancelled', 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_time_out_before_expected CHECK (time_out < expected_time_in)
);

CREATE INDEX idx_pass_slips_employee_id ON pass_slips(employee_id);
CREATE INDEX idx_pass_slips_status ON pass_slips(status);
CREATE INDEX idx_pass_slips_date ON pass_slips(date);
CREATE INDEX idx_pass_slips_reference_no ON pass_slips(reference_no);
```

#### 2.2.4 Leave Management Tables

**Table: leave_types**
```sql
CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- 'VL', 'SL', 'ML', 'PL', 'SPL', etc.
    accrual_rate DECIMAL(5,2) DEFAULT 0, -- Days per month (e.g., 1.25 for VL/SL)
    max_balance DECIMAL(6,2), -- Maximum balance (e.g., 300 for VL/SL)
    requires_medical_cert BOOLEAN DEFAULT FALSE,
    monetizable BOOLEAN DEFAULT FALSE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for CSC leave types
INSERT INTO leave_types (name, code, accrual_rate, max_balance, requires_medical_cert, monetizable, description) VALUES
('Vacation Leave', 'VL', 1.25, 300, FALSE, TRUE, 'Vacation leave per CSC rules'),
('Sick Leave', 'SL', 1.25, 300, TRUE, TRUE, 'Sick leave per CSC rules'),
('Maternity Leave', 'ML', 0, NULL, TRUE, FALSE, '105 days maternity leave'),
('Paternity Leave', 'PL', 0, NULL, FALSE, FALSE, '7 days paternity leave'),
('Special Privilege Leave', 'SPL', 0, 3, FALSE, FALSE, '3 days per year for qualified employees'),
('Solo Parent Leave', 'SPL_PARENT', 0, 7, FALSE, FALSE, '7 days per year for solo parents'),
('Study Leave', 'STUDY', 0, NULL, FALSE, FALSE, 'Study leave for approved educational programs');
```

**Table: leave_requests**
```sql
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(30) UNIQUE NOT NULL, -- Format: LR-YYYY-NNNN
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id),
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    num_days DECIMAL(4,2) NOT NULL, -- Supports half-day (0.5)
    is_half_day BOOLEAN DEFAULT FALSE,
    half_day_period VARCHAR(2), -- 'AM', 'PM'
    reason TEXT,
    attachment_path VARCHAR(500), -- Medical certificate or supporting document
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Denied', 'Cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_date_from_before_to CHECK (date_from <= date_to),
    CONSTRAINT chk_num_days_positive CHECK (num_days > 0)
);

CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_leave_type_id ON leave_requests(leave_type_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_date_from ON leave_requests(date_from);
CREATE INDEX idx_leave_requests_date_to ON leave_requests(date_to);
```

**Table: leave_balances**
```sql
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    current_balance DECIMAL(6,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, leave_type_id),
    CONSTRAINT chk_balance_non_negative CHECK (current_balance >= 0)
);

CREATE INDEX idx_leave_balances_employee_id ON leave_balances(employee_id);
CREATE INDEX idx_leave_balances_leave_type_id ON leave_balances(leave_type_id);
```

**Table: leave_credits**
```sql
CREATE TABLE leave_credits (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    amount DECIMAL(6,2) NOT NULL, -- Positive for accrual/adjustment, negative for usage
    transaction_type VARCHAR(30) NOT NULL, -- 'Accrual', 'Usage', 'Adjustment', 'Opening Balance'
    reason TEXT,
    balance_after DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_leave_credits_employee_id ON leave_credits(employee_id);
CREATE INDEX idx_leave_credits_leave_type_id ON leave_credits(leave_type_id);
CREATE INDEX idx_leave_credits_created_at ON leave_credits(created_at);
```

**Table: leave_monetization**
```sql
CREATE TABLE leave_monetization (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    retirement_date DATE NOT NULL,
    vl_balance DECIMAL(6,2) NOT NULL,
    sl_balance DECIMAL(6,2) NOT NULL,
    total_monetizable_days DECIMAL(6,2) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_leave_monetization_employee_id ON leave_monetization(employee_id);
```

#### 2.2.5 Certificate Tables

**Table: certificate_templates**
```sql
CREATE TABLE certificate_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    certificate_type VARCHAR(50) NOT NULL, -- 'Employment', 'Clearance', 'Leave Credits', 'Service Record', etc.
    template_content TEXT NOT NULL, -- HTML/Rich text template with placeholders
    placeholders JSONB, -- Array of available placeholders: ["{{employee_name}}", "{{position}}", etc.]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_certificate_templates_certificate_type ON certificate_templates(certificate_type);
```

**Table: certificates**
```sql
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(30) UNIQUE NOT NULL, -- Format: CERT-YYYY-NNNN
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL REFERENCES certificate_templates(id),
    signatory_id INTEGER REFERENCES employees(id), -- Employee who signs the certificate
    file_path_pdf VARCHAR(500),
    file_path_word VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'Issued', -- 'Issued', 'Revoked', 'Reissued'
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    issued_by INTEGER REFERENCES users(id),
    revocation_reason TEXT,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_employee_id ON certificates(employee_id);
CREATE INDEX idx_certificates_template_id ON certificates(template_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_issued_date ON certificates(issued_date);
CREATE INDEX idx_certificates_reference_no ON certificates(reference_no);
```

**Table: digital_signatures**
```sql
CREATE TABLE digital_signatures (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    signature_path VARCHAR(500) NOT NULL,
    signature_title VARCHAR(100), -- e.g., "HR Manager", "Office Director"
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_digital_signatures_employee_id ON digital_signatures(employee_id);
```

#### 2.2.6 Workflow & Approval Tables

**Table: approval_workflows**
```sql
CREATE TABLE approval_workflows (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    entity_type VARCHAR(30) NOT NULL, -- 'pass_slip', 'leave_request'
    pass_slip_type VARCHAR(20), -- 'Planned', 'Emergency' (for pass slips only)
    workflow_config JSONB NOT NULL, -- JSON array of approval levels
    -- Example: [{"level": 1, "approver_role": "Supervisor", "department_scope": "same"}, ...]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_approval_workflows_department_id ON approval_workflows(department_id);
CREATE INDEX idx_approval_workflows_entity_type ON approval_workflows(entity_type);
```

**Table: approvals**
```sql
CREATE TABLE approvals (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(30) NOT NULL, -- 'pass_slip', 'leave_request'
    entity_id INTEGER NOT NULL, -- ID of pass_slip or leave_request
    approval_level INTEGER NOT NULL,
    approver_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(20) NOT NULL, -- 'Approved', 'Denied'
    comments TEXT,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_entity_type_id ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
```

#### 2.2.7 System Configuration Tables

**Table: holidays**
```sql
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'Regular', 'Special Non-Working'
    recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_holidays_date ON holidays(date);

-- Seed data for Philippine holidays
INSERT INTO holidays (date, name, type, recurring) VALUES
('2025-01-01', 'New Year''s Day', 'Regular', TRUE),
('2025-04-09', 'Araw ng Kagitingan', 'Regular', FALSE),
('2025-05-01', 'Labor Day', 'Regular', TRUE),
('2025-06-12', 'Independence Day', 'Regular', TRUE),
('2025-08-25', 'National Heroes Day', 'Regular', FALSE),
('2025-11-30', 'Bonifacio Day', 'Regular', TRUE),
('2025-12-25', 'Christmas Day', 'Regular', TRUE),
('2025-12-30', 'Rizal Day', 'Regular', TRUE);
```

**Table: system_config**
```sql
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Seed data for system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('password_expiry_days', '90', 'Number of days before password expires'),
('password_min_length', '8', 'Minimum password length'),
('session_timeout_minutes', '480', 'Session timeout in minutes (8 hours)'),
('max_failed_login_attempts', '5', 'Maximum failed login attempts before account lockout'),
('leave_advance_notice_days', '0', 'Minimum days advance notice for leave requests'),
('default_password', 'Welcome2024!', 'Default password for new users'),
('office_name', 'Government Office', 'Office name for certificates and reports');
```

#### 2.2.8 Audit & Logging Tables

**Table: audit_logs**
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'Create', 'Update', 'Delete', 'Approve', 'Deny', 'Login', 'Logout', etc.
    module VARCHAR(30) NOT NULL, -- 'PassSlip', 'Leave', 'Certificate', 'User', 'System'
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details JSONB, -- JSON object with before/after values, additional context
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

### 2.3 Database Migration Strategy

**Migration Tool:** Knex.js migrations

**Migration Naming Convention:** `YYYYMMDDHHMMSS_description.js`

**Migration Execution Order:**
1. `20250106000001_create_users_and_roles.js` - Authentication tables
2. `20250106000002_create_departments_and_employees.js` - Employee management tables
3. `20250106000003_create_pass_slips.js` - Pass slip tables
4. `20250106000004_create_leave_management.js` - Leave management tables
5. `20250106000005_create_certificates.js` - Certificate tables
6. `20250106000006_create_workflows_and_approvals.js` - Workflow tables
7. `20250106000007_create_system_config.js` - System configuration tables
8. `20250106000008_create_audit_logs.js` - Audit logging tables
9. `20250106000009_seed_initial_data.js` - Seed roles, permissions, leave types, holidays

**Rollback Strategy:** Each migration includes `down()` function to reverse changes

**Data Integrity Rules:**
- Foreign key constraints with appropriate CASCADE/SET NULL rules
- Check constraints for data validation
- Unique constraints for business keys (employee_id, reference numbers)
- NOT NULL constraints for required fields
- Default values for status fields and timestamps

---

## 3. API Architecture

### 3.1 RESTful API Design Principles

**Base URL:** `http://localhost:3000/api` (development), `https://hrms.gov.ph/api` (production)

**API Versioning:** Not implemented in v1.0 (future: `/api/v1/...`)

**HTTP Methods:**
- **GET:** Retrieve resources (idempotent, safe)
- **POST:** Create new resources
- **PUT:** Update existing resources (full replacement)
- **PATCH:** Partial update of resources
- **DELETE:** Remove resources (soft delete preferred)

**Status Codes:**
- **200 OK:** Successful GET, PUT, PATCH
- **201 Created:** Successful POST
- **204 No Content:** Successful DELETE
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Business logic conflict (e.g., duplicate employee_id)
- **422 Unprocessable Entity:** Validation errors
- **500 Internal Server Error:** Server-side error

**Response Format:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-10-06T10:30:00Z"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {"field": "email", "message": "Invalid email format"}
    ]
  },
  "timestamp": "2025-10-06T10:30:00Z"
}
```

**Pagination:**
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 150,
    "totalPages": 6
  }
}
```

### 3.2 API Endpoint Specification

#### 3.2.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/auth/login` | User login | No | All |
| POST | `/api/auth/logout` | User logout | Yes | All |
| GET | `/api/auth/me` | Get current user profile | Yes | All |
| PUT | `/api/auth/change-password` | Change password | Yes | All |
| POST | `/api/auth/reset-password` | Admin-assisted password reset | Yes | System Admin |

**POST /api/auth/login**
```json
Request:
{
  "username": "jdoe",
  "password": "SecurePass123!",
  "rememberMe": false
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "jdoe",
      "employeeId": "2025-0001",
      "fullName": "John Doe",
      "roles": ["Employee", "Supervisor"]
    },
    "expiresAt": "2025-10-06T18:30:00Z"
  }
}
```

#### 3.2.2 User Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users` | List all users | Yes | System Admin |
| POST | `/api/users` | Create new user | Yes | System Admin |
| GET | `/api/users/:id` | Get user details | Yes | System Admin |
| PUT | `/api/users/:id` | Update user | Yes | System Admin |
| PATCH | `/api/users/:id/status` | Activate/deactivate user | Yes | System Admin |
| POST | `/api/users/:id/reset-password` | Generate temporary password | Yes | System Admin |

#### 3.2.3 Employee Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/employees` | List employees (with filters) | Yes | All (scope by role) |
| POST | `/api/employees` | Create employee | Yes | HR Admin |
| GET | `/api/employees/:id` | Get employee details | Yes | All (scope by role) |
| PUT | `/api/employees/:id` | Update employee | Yes | HR Admin |
| POST | `/api/employees/import` | Bulk import employees | Yes | HR Admin |
| GET | `/api/employees/export` | Export employees to CSV | Yes | HR Admin, Supervisor |

#### 3.2.4 Department Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/departments` | List all departments (tree) | Yes | All |
| POST | `/api/departments` | Create department | Yes | HR Admin |
| PUT | `/api/departments/:id` | Update department | Yes | HR Admin |
| DELETE | `/api/departments/:id` | Delete department | Yes | HR Admin |

#### 3.2.5 Pass Slip Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/pass-slips` | List pass slips (filtered by role) | Yes | All |
| POST | `/api/pass-slips` | Create pass slip request | Yes | All |
| GET | `/api/pass-slips/:id` | Get pass slip details | Yes | All (scope by role) |
| PUT | `/api/pass-slips/:id/approve` | Approve pass slip | Yes | Supervisor, HR Admin |
| PUT | `/api/pass-slips/:id/deny` | Deny pass slip | Yes | Supervisor, HR Admin |
| PUT | `/api/pass-slips/:id/return` | Record return time | Yes | Employee (own), Supervisor |
| PUT | `/api/pass-slips/:id/cancel` | Cancel pass slip | Yes | Employee (own) |

#### 3.2.6 Leave Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/leave-types` | List leave types | Yes | All |
| POST | `/api/leave-types` | Create leave type | Yes | HR Admin |
| PUT | `/api/leave-types/:id` | Update leave type | Yes | HR Admin |
| GET | `/api/leave-requests` | List leave requests | Yes | All (scope by role) |
| POST | `/api/leave-requests` | Create leave request | Yes | All |
| GET | `/api/leave-requests/:id` | Get leave request details | Yes | All (scope by role) |
| PUT | `/api/leave-requests/:id/approve` | Approve leave request | Yes | Supervisor, HR Admin |
| PUT | `/api/leave-requests/:id/deny` | Deny leave request | Yes | Supervisor, HR Admin |
| PUT | `/api/leave-requests/:id/cancel` | Cancel leave request | Yes | Employee (own) |
| PUT | `/api/leave-requests/:id` | Modify leave request | Yes | Employee (own, pending only) |
| GET | `/api/leave-requests/calendar` | Get leave calendar | Yes | All (scope by role) |
| GET | `/api/leave-balances/:employeeId` | Get leave balances | Yes | All (own or authorized) |
| GET | `/api/leave-credits/:employeeId` | Get leave credit history | Yes | All (own or authorized) |
| POST | `/api/leave-credits/adjust` | Manual leave credit adjustment | Yes | HR Admin |
| POST | `/api/leave-monetization` | Calculate leave monetization | Yes | HR Admin |

#### 3.2.7 Certificate Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/certificate-templates` | List certificate templates | Yes | HR Admin |
| POST | `/api/certificate-templates` | Create template | Yes | HR Admin |
| PUT | `/api/certificate-templates/:id` | Update template | Yes | HR Admin |
| POST | `/api/certificates/generate` | Generate single certificate | Yes | HR Admin |
| POST | `/api/certificates/batch` | Generate batch certificates | Yes | HR Admin |
| GET | `/api/certificates` | List issued certificates | Yes | HR Admin |
| GET | `/api/certificates/:id/download` | Download certificate PDF | Yes | HR Admin |
| PUT | `/api/certificates/:id/revoke` | Revoke certificate | Yes | HR Admin |
| GET | `/api/signatures` | List digital signatures | Yes | HR Admin |
| POST | `/api/signatures` | Upload digital signature | Yes | HR Admin |
| DELETE | `/api/signatures/:id` | Remove digital signature | Yes | HR Admin |

#### 3.2.8 Reporting Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/dashboard/:role` | Get role-specific dashboard data | Yes | All |
| GET | `/api/reports/pass-slips` | Generate pass slip report | Yes | HR Admin, Supervisor |
| GET | `/api/reports/leave` | Generate leave report | Yes | HR Admin, Supervisor |
| GET | `/api/reports/certificates` | Generate certificate report | Yes | HR Admin |
| GET | `/api/reports/employees` | Generate employee report | Yes | HR Admin |
| GET | `/api/audit-log` | View audit log | Yes | System Admin |

#### 3.2.9 System Configuration Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/holidays` | List holidays | Yes | All |
| POST | `/api/holidays` | Add holiday | Yes | HR Admin |
| PUT | `/api/holidays/:id` | Update holiday | Yes | HR Admin |
| DELETE | `/api/holidays/:id` | Delete holiday | Yes | HR Admin |
| GET | `/api/workflows` | List approval workflows | Yes | HR Admin |
| POST | `/api/workflows` | Create/update workflow | Yes | HR Admin |
| GET | `/api/system-config` | Get system configuration | Yes | System Admin |
| PUT | `/api/system-config` | Update system configuration | Yes | System Admin |

### 3.3 API Authentication & Authorization Flow

**Authentication Flow:**
1. Client sends POST `/api/auth/login` with credentials
2. Server validates credentials against `users` table
3. Server generates JWT token with payload: `{userId, username, roles, exp}`
4. Server returns token to client
5. Client stores token (localStorage or sessionStorage)
6. Client includes token in `Authorization: Bearer <token>` header for subsequent requests
7. Server validates token on each protected route via `auth` middleware
8. Token expires after 8 hours (configurable)

**Authorization Flow:**
1. After authentication, `authorize` middleware checks user permissions
2. Middleware queries `user_roles` and `role_permissions` tables
3. Middleware verifies user has required permission for the endpoint
4. If authorized, request proceeds to controller
5. If not authorized, returns 403 Forbidden

**JWT Token Payload:**
```json
{
  "userId": 1,
  "username": "jdoe",
  "employeeId": "2025-0001",
  "roles": ["Employee", "Supervisor"],
  "permissions": ["pass_slip.create", "pass_slip.approve", "leave.create", "leave.approve"],
  "iat": 1704528000,
  "exp": 1704556800
}
```

---

## 4. Application Architecture

### 4.1 Layered Architecture Pattern

**Layer 1: API Layer (Routes + Controllers)**
- Handles HTTP requests/responses
- Input validation using Joi schemas
- Delegates business logic to Service layer
- Returns standardized JSON responses

**Layer 2: Business Logic Layer (Services)**
- Contains core business rules and workflows
- Orchestrates operations across multiple repositories
- Implements leave calculation, approval workflows, certificate generation
- Transaction management for multi-step operations

**Layer 3: Data Access Layer (Repositories)**
- Abstracts database operations
- Executes SQL queries using Knex.js
- Returns plain JavaScript objects (not ORM models)
- Handles database transactions

**Layer 4: Database Layer**
- PostgreSQL database
- Enforces data integrity through constraints
- Stores all application data

### 4.2 Key Service Modules

**AuthService** (`services/auth.service.js`)
- `login(username, password)` - Authenticate user, generate JWT token
- `logout(token)` - Invalidate session
- `changePassword(userId, currentPassword, newPassword)` - Change password with validation
- `validateToken(token)` - Verify JWT token validity
- `checkPasswordExpiry(userId)` - Check if password expired

**EmployeeService** (`services/employee.service.js`)
- `createEmployee(employeeData)` - Create employee record
- `updateEmployee(id, employeeData)` - Update employee information
- `getEmployee(id)` - Retrieve employee details
- `searchEmployees(filters, pagination)` - Search with filters
- `importEmployees(csvData)` - Bulk import from CSV
- `exportEmployees(filters)` - Export to CSV

**PassSlipService** (`services/passSlip.service.js`)
- `createPassSlip(passSlipData)` - Create pass slip request
- `approvePassSlip(id, approverId, comments)` - Approve pass slip
- `denyPassSlip(id, approverId, reason)` - Deny pass slip
- `recordReturn(id, actualTimeIn)` - Record return time
- `cancelPassSlip(id, userId)` - Cancel pass slip
- `getPassSlips(filters, userId, userRoles)` - Get pass slips with role-based filtering

**LeaveService** (`services/leave.service.js`)
- `createLeaveRequest(leaveData)` - Create leave request with balance check
- `approveLeaveRequest(id, approverId)` - Approve and deduct credits
- `denyLeaveRequest(id, approverId, reason)` - Deny leave request
- `cancelLeaveRequest(id, userId)` - Cancel and restore credits
- `getLeaveBalance(employeeId, leaveTypeId)` - Get current balance
- `getLeaveHistory(employeeId, filters)` - Get leave credit history
- `adjustLeaveCredits(employeeId, leaveTypeId, amount, reason, adminId)` - Manual adjustment

**LeaveCalculationService** (`services/leaveCalculation.service.js`)
- `calculateWorkingDays(dateFrom, dateTo)` - Calculate working days excluding weekends and holidays
- `accrueMonthlyLeaveCredits()` - Monthly job to accrue VL/SL credits
- `calculateLeaveMonetization(employeeId, retirementDate)` - Calculate terminal leave pay
- `checkLeaveConflicts(employeeId, dateFrom, dateTo)` - Check for overlapping leaves
- `prorateAccrual(employeeId, month)` - Prorate accrual for partial months

**CertificateService** (`services/certificate.service.js`)
- `generateCertificate(employeeId, templateId, signatoryId)` - Generate single certificate
- `generateBatchCertificates(employeeIds, templateId, signatoryId)` - Batch generation
- `populateTemplate(template, employeeData)` - Replace placeholders with data
- `generatePDF(content, outputPath)` - Create PDF file
- `generateWord(content, outputPath)` - Create Word file
- `revokeCertificate(id, reason, adminId)` - Revoke certificate

**WorkflowService** (`services/workflow.service.js`)
- `getApprovalWorkflow(departmentId, entityType, passSlipType)` - Get workflow configuration
- `determineNextApprover(workflowConfig, currentLevel, employeeId)` - Find next approver
- `recordApproval(entityType, entityId, approverId, action, comments)` - Log approval action
- `isWorkflowComplete(entityType, entityId)` - Check if all approvals obtained
- `notifyApprover(approverId, entityType, entityId)` - Send notification to approver

**NotificationService** (`services/notification.service.js`)
- `sendEmail(to, subject, body)` - Send email notification (optional)
- `createInAppNotification(userId, message, link)` - Create in-app notification
- `notifyPassSlipStatus(passSlipId, status)` - Notify employee of pass slip status change
- `notifyLeaveStatus(leaveRequestId, status)` - Notify employee of leave status change
- `notifyPendingApproval(approverId, entityType, entityId)` - Notify approver of pending request

**ReportService** (`services/report.service.js`)
- `generatePassSlipReport(filters)` - Generate pass slip report data
- `generateLeaveReport(reportType, filters)` - Generate leave report (monthly, quarterly, annual)
- `generateCertificateReport(filters)` - Generate certificate issuance report
- `generateEmployeeReport(reportType, filters)` - Generate employee reports
- `exportToPDF(reportData, template)` - Export report to PDF
- `exportToExcel(reportData, columns)` - Export report to Excel

### 4.3 Middleware Stack

**Request Processing Order:**
1. `cors` - Enable CORS for frontend
2. `helmet` - Security headers
3. `express.json()` - Parse JSON request bodies
4. `express.urlencoded()` - Parse URL-encoded bodies
5. `morgan` - HTTP request logging
6. `auth` - JWT authentication (protected routes only)
7. `authorize` - RBAC authorization (protected routes only)
8. `validate` - Request validation using Joi schemas
9. **Route Handler** (Controller)
10. `auditLog` - Log action to audit_logs table
11. `errorHandler` - Global error handling

**Middleware Implementations:**

**auth.js** - JWT Authentication
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication required' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {userId, username, roles, permissions}
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};
```

**authorize.js** - RBAC Authorization
```javascript
module.exports = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }

    next();
  };
};
```

**validate.js** - Request Validation
```javascript
const Joi = require('joi');

module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details
        }
      });
    }

    req.validatedData = value;
    next();
  };
};
```

**auditLog.js** - Audit Logging
```javascript
const auditLogRepository = require('../repositories/auditLog.repository');

module.exports = (module, action) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = async (data) => {
      // Log to audit_logs table
      await auditLogRepository.create({
        user_id: req.user?.userId,
        action,
        module,
        entity_type: req.params.entityType,
        entity_id: req.params.id,
        details: { request: req.body, response: data },
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });

      return originalJson(data);
    };

    next();
  };
};
```

---

## 5. Frontend Architecture

### 5.1 Vue.js Application Structure

**State Management:** Pinia (Vue 3 recommended store)

**Routing:** Vue Router with route guards for authentication

**HTTP Client:** Axios with interceptors for token injection and error handling

### 5.2 Component Hierarchy

**Layout Components:**
- `AppLayout.vue` - Main application layout with navigation
- `AuthLayout.vue` - Login page layout
- `DashboardLayout.vue` - Dashboard container with sidebar

**Common Components:**
- `DataTable.vue` - Reusable table with sorting, filtering, pagination
- `FormInput.vue` - Styled input field with validation
- `FormSelect.vue` - Styled dropdown with search
- `DatePicker.vue` - Date selection component
- `TimePicker.vue` - Time selection component
- `Modal.vue` - Reusable modal dialog
- `Button.vue` - Styled button component
- `Badge.vue` - Status badge component
- `Card.vue` - Card container component
- `Notification.vue` - Toast notification component

**Feature Components:**
- `PassSlipForm.vue` - Pass slip request form
- `PassSlipApprovalCard.vue` - Pass slip approval interface
- `LeaveRequestForm.vue` - Leave request wizard
- `LeaveCalendar.vue` - Calendar view for leaves
- `LeaveBalanceCard.vue` - Leave balance display
- `CertificateGenerator.vue` - Certificate generation interface
- `EmployeeForm.vue` - Employee CRUD form
- `ReportBuilder.vue` - Report parameter selection

### 5.3 Routing Structure

```javascript
const routes = [
  { path: '/login', component: Login, meta: { layout: 'auth' } },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: RoleDashboard }, // Dynamically loads based on role
      { path: 'employee', component: EmployeeDashboard },
      { path: 'supervisor', component: SupervisorDashboard },
      { path: 'hr-admin', component: HRAdminDashboard },
      { path: 'system-admin', component: SystemAdminDashboard }
    ]
  },
  {
    path: '/pass-slips',
    meta: { requiresAuth: true, permission: 'pass_slip.read_own' },
    children: [
      { path: '', component: PassSlipList },
      { path: 'new', component: PassSlipForm },
      { path: ':id', component: PassSlipDetail },
      { path: 'approvals', component: PassSlipApprovals, meta: { permission: 'pass_slip.approve' } }
    ]
  },
  {
    path: '/leave',
    meta: { requiresAuth: true, permission: 'leave.read_own' },
    children: [
      { path: '', component: LeaveList },
      { path: 'new', component: LeaveRequestForm },
      { path: ':id', component: LeaveDetail },
      { path: 'calendar', component: LeaveCalendar },
      { path: 'balance', component: LeaveBalance },
      { path: 'approvals', component: LeaveApprovals, meta: { permission: 'leave.approve' } }
    ]
  },
  {
    path: '/certificates',
    meta: { requiresAuth: true, permission: 'certificate.generate' },
    children: [
      { path: '', component: CertificateList },
      { path: 'generate', component: CertificateGenerator },
      { path: 'templates', component: CertificateTemplates }
    ]
  },
  {
    path: '/employees',
    meta: { requiresAuth: true, permission: 'employee.read_all' },
    children: [
      { path: '', component: EmployeeList },
      { path: 'new', component: EmployeeForm },
      { path: ':id', component: EmployeeDetail },
      { path: ':id/edit', component: EmployeeForm }
    ]
  },
  {
    path: '/reports',
    meta: { requiresAuth: true, permission: 'report.view_all' },
    children: [
      { path: 'pass-slips', component: PassSlipReports },
      { path: 'leave', component: LeaveReports },
      { path: 'certificates', component: CertificateReports },
      { path: 'employees', component: EmployeeReports }
    ]
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, permission: 'system.admin' },
    children: [
      { path: 'users', component: UserManagement },
      { path: 'departments', component: DepartmentManagement },
      { path: 'holidays', component: HolidayManagement },
      { path: 'workflows', component: WorkflowConfiguration },
      { path: 'audit-log', component: AuditLogViewer },
      { path: 'system-config', component: SystemConfiguration }
    ]
  }
];
```

### 5.4 State Management (Pinia Stores)

**authStore** - Authentication state
- State: `user`, `token`, `isAuthenticated`
- Actions: `login()`, `logout()`, `refreshToken()`, `checkAuth()`

**employeeStore** - Employee data
- State: `employees`, `currentEmployee`, `departments`
- Actions: `fetchEmployees()`, `createEmployee()`, `updateEmployee()`

**passSlipStore** - Pass slip data
- State: `passSlips`, `pendingApprovals`
- Actions: `fetchPassSlips()`, `createPassSlip()`, `approvePassSlip()`

**leaveStore** - Leave management
- State: `leaveRequests`, `leaveBalances`, `leaveTypes`
- Actions: `fetchLeaveRequests()`, `createLeaveRequest()`, `approveLeaveRequest()`

**certificateStore** - Certificate data
- State: `certificates`, `templates`
- Actions: `generateCertificate()`, `fetchCertificates()`

### 5.5 API Service Layer

**api.js** - Axios instance with interceptors
```javascript
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000
});

// Request interceptor - inject JWT token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 6. Security Architecture

### 6.1 Authentication Security

**Password Security:**
- Hashing: bcrypt with salt rounds = 12
- Complexity requirements: 8+ chars, uppercase, lowercase, number, special char
- Password history: Store last 3 password hashes, prevent reuse
- Password expiry: 90 days (configurable)
- Account lockout: 5 failed attempts within 15 minutes

**Session Security:**
- JWT tokens with 8-hour expiry
- Token stored in httpOnly cookie (production) or localStorage (development)
- Session invalidation on logout
- No refresh tokens in v1.0 (user must re-login after expiry)

### 6.2 Authorization Security

**Role-Based Access Control (RBAC):**
- 4 roles: Employee, Supervisor, HR Administrator, System Administrator
- Permissions checked on every API request
- Frontend hides unauthorized UI elements
- Backend enforces permissions regardless of frontend

**Data Access Control:**
- Employees can only view/modify their own records
- Supervisors can view/approve for their department only
- HR Admins have full access to all employee data
- System Admins have full system access

### 6.3 Input Validation & Sanitization

**Validation Strategy:**
- Frontend: Vue.js form validation for UX
- Backend: Joi schema validation for security
- Database: Constraints and check rules for data integrity

**SQL Injection Prevention:**
- Parameterized queries using Knex.js query builder
- No raw SQL with user input
- Input sanitization for special characters

**XSS Prevention:**
- Output encoding in Vue.js templates (automatic)
- Content Security Policy (CSP) headers
- Sanitize rich text input for certificate templates

**CSRF Prevention:**
- CSRF tokens for state-changing operations
- SameSite cookie attribute
- Origin header validation

### 6.4 Audit Logging

**What to Log:**
- All authentication events (login, logout, failed attempts)
- All data modifications (create, update, delete)
- All approval actions (approve, deny)
- All administrative actions (user management, configuration changes)
- All certificate generations
- All report exports

**What NOT to Log:**
- Passwords (plain or hashed)
- JWT tokens
- Sensitive personal data (beyond entity IDs)

**Log Retention:**
- Minimum 3 years per government requirements
- Logs are immutable (no edit/delete capability)
- Regular archival to separate storage

---

## 7. Document Generation Architecture

### 7.1 Certificate Generation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User selects employee + template + signatory            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  2. CertificateService.generateCertificate()                │
│     - Fetch employee data from database                     │
│     - Fetch template content                                │
│     - Fetch signatory signature image                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  3. populateTemplate(template, employeeData)                │
│     - Replace {{employee_name}} with actual name            │
│     - Replace {{position}} with actual position             │
│     - Replace all placeholders with employee data           │
│     - Format dates per Philippine conventions               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  4. generatePDF(content, signatureImage)                    │
│     - Use PDFKit to create PDF document                     │
│     - Add government letterhead                             │
│     - Insert populated content                              │
│     - Position signature image                              │
│     - Add reference number and QR code                      │
│     - Save to storage/certificates/CERT-YYYY-NNNN.pdf       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  5. generateWord(content) [Optional]                        │
│     - Use docxtemplater to create Word document             │
│     - Save to storage/certificates/CERT-YYYY-NNNN.docx      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  6. Log certificate issuance                                │
│     - Insert record into certificates table                 │
│     - Log to audit_logs                                     │
│     - Return file paths to client                           │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Template Placeholder System

**Available Placeholders:**
- `{{employee_name}}` - Full name (First Middle Last Suffix)
- `{{employee_id}}` - Employee ID
- `{{position}}` - Position/Title
- `{{department}}` - Department name
- `{{salary_grade}}` - Salary grade
- `{{date_hired}}` - Date hired (formatted)
- `{{date_regularized}}` - Date regularized (formatted)
- `{{years_of_service}}` - Calculated years of service
- `{{vl_balance}}` - Current VL balance
- `{{sl_balance}}` - Current SL balance
- `{{current_date}}` - Current date (formatted)
- `{{signatory_name}}` - Signatory full name
- `{{signatory_title}}` - Signatory position/title
- `{{office_name}}` - Office name from system_config
- `{{reference_no}}` - Certificate reference number

**Template Example:**
```html
<div class="certificate">
  <div class="letterhead">
    <img src="government-seal.png" />
    <h1>{{office_name}}</h1>
  </div>

  <h2>CERTIFICATE OF EMPLOYMENT</h2>

  <p>This is to certify that <strong>{{employee_name}}</strong>,
  Employee ID <strong>{{employee_id}}</strong>, has been employed
  in this office as <strong>{{position}}</strong> since
  <strong>{{date_hired}}</strong>.</p>

  <p>This certification is issued upon the request of the above-named
  employee for whatever legal purpose it may serve.</p>

  <p>Issued this <strong>{{current_date}}</strong>.</p>

  <div class="signature">
    <img src="{{signature_image}}" />
    <p><strong>{{signatory_name}}</strong><br/>{{signatory_title}}</p>
  </div>

  <div class="footer">
    <p>Reference No: {{reference_no}}</p>
  </div>
</div>
```

### 7.3 Batch Generation Process

**Batch Processing Strategy:**
1. Accept array of employee IDs
2. Process sequentially (not parallel to avoid resource exhaustion)
3. Generate certificate for each employee
4. Collect results: {employeeId, success, filePath, error}
5. Create ZIP archive of all generated PDFs
6. Return summary: total, successful, failed, downloadLink

**Error Handling:**
- Individual failures don't stop batch process
- Failed certificates logged with error reason
- User receives summary with list of failures
- Failed certificates can be regenerated individually

---

## 8. Leave Calculation Engine

### 8.1 Working Day Calculation Algorithm

**Function:** `calculateWorkingDays(dateFrom, dateTo)`

**Algorithm:**
```javascript
function calculateWorkingDays(dateFrom, dateTo) {
  let workingDays = 0;
  let currentDate = new Date(dateFrom);
  const endDate = new Date(dateTo);

  // Fetch Philippine holidays from database
  const holidays = await getHolidays(dateFrom.getFullYear(), dateTo.getFullYear());
  const holidayDates = holidays.map(h => h.date.toISOString().split('T')[0]);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dateString = currentDate.toISOString().split('T')[0];

    // Count if not weekend and not holiday
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.includes(dateString)) {
      workingDays++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}
```

### 8.2 Monthly Leave Accrual Process

**Scheduled Job:** Runs on 1st day of each month at 12:01 AM (node-cron)

**Accrual Algorithm:**
```javascript
async function accrueMonthlyLeaveCredits() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Get all Regular employees
  const employees = await employeeRepository.findByEmploymentStatus('Regular');

  // Get VL and SL leave types
  const vlType = await leaveTypeRepository.findByCode('VL');
  const slType = await leaveTypeRepository.findByCode('SL');

  for (const employee of employees) {
    // Calculate proration for employees hired mid-month
    const daysEmployed = calculateDaysEmployedInMonth(employee.date_hired, currentMonth, currentYear);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prorationFactor = daysEmployed / daysInMonth;

    // Accrue VL
    const vlAccrual = 1.25 * prorationFactor;
    await accrueLeaveCredit(employee.id, vlType.id, vlAccrual, 'Monthly Accrual');

    // Accrue SL
    const slAccrual = 1.25 * prorationFactor;
    await accrueLeaveCredit(employee.id, slType.id, slAccrual, 'Monthly Accrual');
  }

  console.log(`Leave accrual completed for ${employees.length} employees`);
}

async function accrueLeaveCredit(employeeId, leaveTypeId, amount, reason) {
  // Get current balance
  const balance = await leaveBalanceRepository.findOne(employeeId, leaveTypeId);
  const currentBalance = balance?.current_balance || 0;

  // Get max balance for leave type
  const leaveType = await leaveTypeRepository.findById(leaveTypeId);
  const maxBalance = leaveType.max_balance;

  // Calculate new balance (enforce max)
  let newBalance = currentBalance + amount;
  let actualAccrual = amount;

  if (maxBalance && newBalance > maxBalance) {
    actualAccrual = maxBalance - currentBalance;
    newBalance = maxBalance;
  }

  // Update balance
  await leaveBalanceRepository.update(employeeId, leaveTypeId, newBalance);

  // Create credit transaction record
  await leaveCreditRepository.create({
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    amount: actualAccrual,
    transaction_type: 'Accrual',
    reason: reason,
    balance_after: newBalance
  });
}
```

### 8.3 Leave Monetization Calculation

**CSC Rules:**
- Maximum 300 days monetizable (VL + SL combined)
- Monetization = Total Days × Daily Rate
- Daily Rate = Monthly Salary / 22 working days

**Algorithm:**
```javascript
async function calculateLeaveMonetization(employeeId, retirementDate) {
  // Get employee salary information
  const employee = await employeeRepository.findById(employeeId);
  const monthlySalary = await getSalaryFromGrade(employee.salary_grade);
  const dailyRate = monthlySalary / 22;

  // Get leave balances
  const vlBalance = await getLeaveBalance(employeeId, 'VL');
  const slBalance = await getLeaveBalance(employeeId, 'SL');

  // Calculate monetizable days (max 300)
  const totalDays = vlBalance + slBalance;
  const monetizableDays = Math.min(totalDays, 300);

  // Calculate total amount
  const totalAmount = monetizableDays * dailyRate;

  // Save monetization record
  await leaveMonetizationRepository.create({
    employee_id: employeeId,
    retirement_date: retirementDate,
    vl_balance: vlBalance,
    sl_balance: slBalance,
    total_monetizable_days: monetizableDays,
    daily_rate: dailyRate,
    total_amount: totalAmount
  });

  return {
    vlBalance,
    slBalance,
    totalDays,
    monetizableDays,
    dailyRate,
    totalAmount
  };
}
```

---

## 9. Approval Workflow Engine

### 9.1 Workflow Configuration Data Model

**Workflow Configuration (JSON stored in approval_workflows table):**
```json
{
  "entity_type": "pass_slip",
  "pass_slip_type": "Planned",
  "levels": [
    {
      "level": 1,
      "approver_role": "Supervisor",
      "department_scope": "same",
      "description": "Immediate supervisor approval"
    },
    {
      "level": 2,
      "approver_role": "HR Administrator",
      "department_scope": "any",
      "description": "HR admin final approval"
    }
  ]
}
```

**Department Scope Options:**
- `same` - Approver must be from same department as employee
- `parent` - Approver must be from parent department
- `any` - Approver can be from any department

### 9.2 Workflow Execution Algorithm

**Function:** `executeApprovalWorkflow(entityType, entityId, action, approverId)`

**Algorithm:**
```javascript
async function executeApprovalWorkflow(entityType, entityId, action, approverId, comments) {
  // Get entity (pass_slip or leave_request)
  const entity = await getEntity(entityType, entityId);
  const employee = await employeeRepository.findById(entity.employee_id);

  // Get workflow configuration
  const workflow = await workflowService.getApprovalWorkflow(
    employee.department_id,
    entityType,
    entity.pass_slip_type || null
  );

  // Get current approval level
  const existingApprovals = await approvalRepository.findByEntity(entityType, entityId);
  const currentLevel = existingApprovals.length + 1;

  // Verify approver has permission for this level
  const workflowLevel = workflow.levels.find(l => l.level === currentLevel);
  if (!workflowLevel) {
    throw new Error('Invalid approval level');
  }

  const approver = await userRepository.findById(approverId);
  const hasPermission = await verifyApproverPermission(approver, workflowLevel, employee);
  if (!hasPermission) {
    throw new Error('Approver not authorized for this workflow level');
  }

  // Record approval/denial
  await approvalRepository.create({
    entity_type: entityType,
    entity_id: entityId,
    approval_level: currentLevel,
    approver_id: approverId,
    action: action, // 'Approved' or 'Denied'
    comments: comments
  });

  // Update entity status
  if (action === 'Denied') {
    await updateEntityStatus(entityType, entityId, 'Denied');
    await notificationService.notifyEmployee(entity.employee_id, entityType, entityId, 'Denied');
  } else if (action === 'Approved') {
    // Check if workflow complete
    if (currentLevel === workflow.levels.length) {
      // Final approval
      await updateEntityStatus(entityType, entityId, 'Approved');

      // Deduct leave credits if leave request
      if (entityType === 'leave_request') {
        await leaveService.deductLeaveCredits(entity.id);
      }

      await notificationService.notifyEmployee(entity.employee_id, entityType, entityId, 'Approved');
    } else {
      // More approvals needed
      await updateEntityStatus(entityType, entityId, 'Pending');

      // Notify next approver
      const nextLevel = workflow.levels.find(l => l.level === currentLevel + 1);
      const nextApprover = await findNextApprover(nextLevel, employee);
      await notificationService.notifyPendingApproval(nextApprover.id, entityType, entityId);
    }
  }

  // Log to audit
  await auditLogRepository.create({
    user_id: approverId,
    action: action,
    module: entityType === 'pass_slip' ? 'PassSlip' : 'Leave',
    entity_type: entityType,
    entity_id: entityId,
    details: { level: currentLevel, comments: comments }
  });
}
```

### 9.3 Dynamic Approver Resolution

**Function:** `findNextApprover(workflowLevel, employee)`

**Algorithm:**
```javascript
async function findNextApprover(workflowLevel, employee) {
  const { approver_role, department_scope } = workflowLevel;

  let departmentId;
  if (department_scope === 'same') {
    departmentId = employee.department_id;
  } else if (department_scope === 'parent') {
    const department = await departmentRepository.findById(employee.department_id);
    departmentId = department.parent_id;
  }

  // Find users with required role in specified department
  const approvers = await userRepository.findByRoleAndDepartment(
    approver_role,
    departmentId
  );

  if (approvers.length === 0) {
    throw new Error(`No approver found with role ${approver_role} in department ${departmentId}`);
  }

  // Return first approver (or implement round-robin, load balancing, etc.)
  return approvers[0];
}
```

---

## 10. Deployment Architecture

### 10.1 Single-Server Deployment (20-100 employees)

**Server Requirements:**
- **OS:** Windows Server 2016+ or Ubuntu 20.04+
- **CPU:** 2 cores minimum, 4 cores recommended
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 50GB minimum, 100GB recommended (SSD preferred)
- **Network:** Local network access, no internet required

**Software Stack:**
- **Web Server:** Nginx 1.24+
- **Application Server:** Node.js 18 LTS with PM2
- **Database:** PostgreSQL 14+
- **Process Manager:** PM2 (for Node.js)

**Installation Steps:**
1. Install PostgreSQL, create database and user
2. Install Node.js 18 LTS
3. Install Nginx
4. Clone HRMS repository
5. Install backend dependencies: `cd backend && npm install`
6. Configure environment variables: `cp .env.example .env`
7. Run database migrations: `npm run migrate`
8. Seed initial data: `npm run seed`
9. Build frontend: `cd ../frontend && npm install && npm run build`
10. Configure Nginx to serve frontend and proxy API requests
11. Start application with PM2: `pm2 start backend/server.js --name hrms`
12. Configure PM2 to start on boot: `pm2 startup && pm2 save`

### 10.2 Multi-Server Deployment (100-500 employees)

**Architecture:**
```
┌─────────────────┐
│  Web Server     │  - Nginx
│  (Frontend)     │  - Serves static files
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  App Server     │  - Node.js/Express
│  (Backend API)  │  - PM2 process manager
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  DB Server      │  - PostgreSQL
│  (Database)     │  - Daily backups
└─────────────────┘
```

**Server Specifications:**
- **Web Server:** 2 CPU, 4GB RAM, 20GB storage
- **App Server:** 4 CPU, 8GB RAM, 50GB storage
- **DB Server:** 4 CPU, 16GB RAM, 200GB storage (SSD)

### 10.3 Nginx Configuration

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name hrms.local;

    # Redirect to HTTPS (production)
    # return 301 https://$server_name$request_uri;

    # Frontend static files
    location / {
        root /var/www/hrms/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # File downloads (certificates, reports)
    location /storage {
        alias /var/www/hrms/storage;
        internal; # Only accessible via X-Accel-Redirect from backend
    }
}
```

### 10.4 Environment Configuration

**.env file:**
```bash
# Application
NODE_ENV=production
PORT=3000
APP_URL=http://hrms.local

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=hrms_user
DB_PASSWORD=secure_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRY=8h

# File Storage
STORAGE_PATH=/var/www/hrms/storage

# Email (Optional)
SMTP_HOST=smtp.local
SMTP_PORT=587
SMTP_USER=hrms@gov.ph
SMTP_PASSWORD=email_password_here
SMTP_FROM=HRMS <hrms@gov.ph>

# System
PASSWORD_EXPIRY_DAYS=90
SESSION_TIMEOUT_MINUTES=480
MAX_FAILED_LOGIN_ATTEMPTS=5
```

### 10.5 Backup & Recovery Strategy

**Database Backup:**
```bash
# Daily automated backup (cron job)
0 2 * * * pg_dump -U hrms_user hrms_db > /backup/hrms_db_$(date +\%Y\%m\%d).sql

# Weekly full backup
0 3 * * 0 tar -czf /backup/hrms_full_$(date +\%Y\%m\%d).tar.gz /var/www/hrms /backup/hrms_db_*.sql
```

**Recovery Procedure:**
```bash
# Restore database
psql -U hrms_user hrms_db < /backup/hrms_db_20250106.sql

# Restore files
tar -xzf /backup/hrms_full_20250106.tar.gz -C /
```

**Backup Retention:**
- Daily backups: Keep 30 days
- Weekly backups: Keep 12 weeks
- Monthly backups: Keep 12 months

### 10.6 Monitoring & Maintenance

**Application Monitoring:**
- PM2 monitoring: `pm2 monit`
- Application logs: `/var/www/hrms/backend/logs/`
- Nginx logs: `/var/log/nginx/`

**Database Maintenance:**
- Weekly VACUUM ANALYZE
- Monthly REINDEX
- Monitor database size and performance

**Security Updates:**
- Monthly OS security patches
- Quarterly dependency updates (`npm audit fix`)
- Annual security audit

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Epic 1) - 2 weeks
- Project setup and development environment
- Database schema implementation
- Authentication system
- RBAC implementation
- User management interface
- Password management

### Phase 2: Employee Management (Epic 2) - 1.5 weeks
- Department management
- Employee CRUD operations
- Bulk import functionality
- Search and filtering
- Holiday calendar management

### Phase 3: Pass Slip Module (Epic 3) - 1.5 weeks
- Pass slip request submission
- Approval workflow implementation
- Time tracking
- History and search
- Workflow configuration

### Phase 4: Leave Management (Epic 4) - 3 weeks
- Leave types configuration
- Leave credit accrual system
- Leave request submission
- Approval workflow
- Calendar and conflict management
- Balance tracking
- Cancellation and modification
- Leave monetization

### Phase 5: Certificate Generation (Epic 5) - 1.5 weeks
- Template management
- Certificate generation interface
- Digital signature management
- Issuance log and tracking
- Batch generation

### Phase 6: Reporting & Analytics (Epic 6) - 1.5 weeks
- Dashboard analytics
- Pass slip reports
- Leave reports (CSC compliance)
- Certificate reports
- Audit log viewer
- Employee reports

**Total Estimated Duration:** 11 weeks (2.75 months)

---

## 12. Conclusion

This architecture document provides a comprehensive technical blueprint for implementing the Philippine Government HRMS. The design prioritizes:

✅ **Simplicity** - Monolithic architecture suitable for government IT staff
✅ **Security** - RBAC, audit logging, input validation, password policies
✅ **Compliance** - CSC regulations, Data Privacy Act, government standards
✅ **Maintainability** - Layered architecture, clear separation of concerns
✅ **Scalability** - Supports 20-500 employees with vertical scaling
✅ **Zero Cost** - 100% open-source technology stack
✅ **On-Premises** - No cloud dependencies, complete data sovereignty

**Next Steps:**
1. Review and approve architecture document
2. Set up development environment per specifications
3. Begin Epic 1 implementation (Foundation & Authentication)
4. Follow sequential epic execution as outlined in PRD

**Document Status:** ✅ **COMPLETE AND READY FOR DEVELOPMENT**

---

*End of Architecture Document*

