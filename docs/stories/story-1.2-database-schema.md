# Story 1.2: Database Schema Foundation

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.2  
**Story Type:** Technical Foundation  
**Priority:** Critical  
**Estimated Effort:** 6-8 hours  
**Dependencies:** Story 1.1 (Project Setup)  
**Status:** Ready for Development

---

## User Story

As a **developer**,  
I want **a complete normalized database schema with all tables, relationships, and constraints**,  
so that **the data model supports all HRMS modules with referential integrity and proper indexing**.

---

## Acceptance Criteria

1. ✅ Database migration scripts create all required tables: users, employees, departments, roles, permissions, role_permissions, user_roles, pass_slips, leave_types, leave_requests, leave_balances, leave_credits, certificates, approval_workflows, audit_logs, system_config, holidays
2. ✅ All tables include standard fields: id (primary key), created_at, updated_at, created_by, updated_by
3. ✅ Foreign key constraints established with appropriate CASCADE/RESTRICT rules
4. ✅ Indexes created on frequently queried columns (employee_id, department_id, status, dates)
5. ✅ Unique constraints applied where appropriate (username, employee_id)
6. ✅ Check constraints enforce data validity (e.g., time_out < time_in, leave_balance >= 0)
7. ✅ Database migration rollback scripts provided for all migrations
8. ✅ Entity-Relationship Diagram (ERD) generated and saved to docs/database-erd.png
9. ✅ Database seed script creates initial data: admin user, default roles (Employee, Supervisor, HR Admin, System Admin), Philippine holidays for current year
10. ✅ Database connection pool configured with appropriate limits

---

## Technical Specifications

### Database: PostgreSQL 14+

### Migration Tool: Knex.js

### Database Configuration (backend/src/config/database.js)

```javascript
const knex = require('knex');

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = knex(config);
```

### Complete Database Schema

**18 Tables Total:**

1. **users** - Authentication and user accounts
2. **roles** - System roles (Employee, Supervisor, HR Admin, System Admin)
3. **permissions** - Granular permissions
4. **role_permissions** - Role-permission mappings
5. **user_roles** - User-role assignments
6. **sessions** - Active user sessions
7. **departments** - Organizational structure
8. **employees** - Employee master data
9. **pass_slips** - Pass slip requests
10. **leave_types** - CSC leave types
11. **leave_requests** - Leave applications
12. **leave_balances** - Current leave balances
13. **leave_credits** - Leave credit transactions
14. **leave_monetization** - Terminal leave calculations
15. **certificate_templates** - Certificate templates
16. **certificates** - Generated certificates log
17. **digital_signatures** - Signatory signatures
18. **approval_workflows** - Workflow configurations
19. **approvals** - Approval history
20. **holidays** - Philippine holiday calendar
21. **system_config** - System configuration
22. **audit_logs** - Comprehensive audit trail

---

## Migration Scripts

### Migration 1: Create Users and Roles Tables

**File:** `migrations/001_create_users_roles.js`

```javascript
exports.up = function(knex) {
  return knex.schema
    // Roles table
    .createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name', 50).notNullable().unique();
      table.string('description', 255);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    
    // Permissions table
    .createTable('permissions', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable().unique();
      table.string('description', 255);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    
    // Role-Permissions mapping
    .createTable('role_permissions', (table) => {
      table.increments('id').primary();
      table.integer('role_id').unsigned().notNullable()
        .references('id').inTable('roles').onDelete('CASCADE');
      table.integer('permission_id').unsigned().notNullable()
        .references('id').inTable('permissions').onDelete('CASCADE');
      table.unique(['role_id', 'permission_id']);
    })
    
    // Users table
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username', 50).notNullable().unique();
      table.string('password_hash', 255).notNullable();
      table.integer('employee_id').unsigned().unique()
        .references('id').inTable('employees').onDelete('SET NULL');
      table.string('status', 20).notNullable().defaultTo('active');
      table.integer('failed_login_attempts').defaultTo(0);
      table.timestamp('last_failed_login');
      table.timestamp('last_login');
      table.timestamp('password_changed_at').defaultTo(knex.fn.now());
      table.timestamp('password_expires_at');
      table.boolean('must_change_password').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('username');
      table.index('status');
    })
    
    // User-Roles mapping
    .createTable('user_roles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('role_id').unsigned().notNullable()
        .references('id').inTable('roles').onDelete('CASCADE');
      table.timestamp('assigned_at').defaultTo(knex.fn.now());
      table.integer('assigned_by').unsigned().references('id').inTable('users');
      table.unique(['user_id', 'role_id']);
    })
    
    // Sessions table
    .createTable('sessions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('token', 500).notNullable().unique();
      table.string('ip_address', 45);
      table.text('user_agent');
      table.timestamp('expires_at').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index('token');
      table.index('expires_at');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('sessions')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('users')
    .dropTableIfExists('role_permissions')
    .dropTableIfExists('permissions')
    .dropTableIfExists('roles');
};
```

### Migration 2: Create Departments and Employees Tables

**File:** `migrations/002_create_departments_employees.js`

```javascript
exports.up = function(knex) {
  return knex.schema
    // Departments table
    .createTable('departments', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.integer('parent_id').unsigned()
        .references('id').inTable('departments').onDelete('SET NULL');
      table.integer('department_head_id').unsigned()
        .references('id').inTable('employees').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('parent_id');
    })
    
    // Employees table
    .createTable('employees', (table) => {
      table.increments('id').primary();
      table.string('employee_id', 30).notNullable().unique();
      table.string('first_name', 100).notNullable();
      table.string('middle_name', 100);
      table.string('last_name', 100).notNullable();
      table.string('suffix', 10);
      table.date('date_of_birth');
      table.string('gender', 20);
      table.string('civil_status', 20);
      table.string('position', 100).notNullable();
      table.string('salary_grade', 20);
      table.integer('department_id').unsigned()
        .references('id').inTable('departments').onDelete('SET NULL');
      table.string('employment_status', 30).notNullable();
      table.date('date_hired').notNullable();
      table.date('date_regularized');
      table.string('email', 100);
      table.string('mobile_number', 20);
      table.string('address_street', 255);
      table.string('address_barangay', 100);
      table.string('address_city', 100);
      table.string('address_province', 100);
      table.string('address_postal_code', 10);
      table.string('status', 20).notNullable().defaultTo('active');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.integer('updated_by').unsigned().references('id').inTable('users');
      
      table.index('employee_id');
      table.index('department_id');
      table.index('status');
      table.index(['last_name', 'first_name']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('employees')
    .dropTableIfExists('departments');
};
```

### Migration 3-9: Additional Tables

Due to length constraints, the remaining migrations follow the same pattern for:
- Pass Slips (migration 003)
- Leave Types and Requests (migration 004)
- Leave Balances and Credits (migration 005)
- Certificates (migration 006)
- Approval Workflows (migration 007)
- System Config and Holidays (migration 008)
- Audit Logs (migration 009)

**Complete SQL schemas are available in Architecture Document Section 2.**

---

## Seed Data

### Seed 1: Roles and Permissions

**File:** `seeds/001_roles_permissions.js`

```javascript
exports.seed = async function(knex) {
  // Clear existing data
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('roles').del();
  
  // Insert roles
  const [employeeRole, supervisorRole, hrAdminRole, sysAdminRole] = await knex('roles').insert([
    { name: 'Employee', description: 'Basic employee access' },
    { name: 'Supervisor', description: 'Department supervisor with approval rights' },
    { name: 'HR Administrator', description: 'HR staff with full employee management' },
    { name: 'System Administrator', description: 'Full system access' }
  ]).returning('id');
  
  // Insert permissions
  const permissions = await knex('permissions').insert([
    { name: 'pass_slip.create', description: 'Create pass slip requests' },
    { name: 'pass_slip.approve', description: 'Approve pass slip requests' },
    { name: 'leave.create', description: 'Create leave requests' },
    { name: 'leave.approve', description: 'Approve leave requests' },
    { name: 'employee.read', description: 'View employee records' },
    { name: 'employee.write', description: 'Create/edit employee records' },
    { name: 'certificate.generate', description: 'Generate certificates' },
    { name: 'reports.view', description: 'View reports' },
    { name: 'system.admin', description: 'System administration' }
  ]).returning('id');
  
  // Map permissions to roles (simplified - see full mapping in Architecture Doc)
  // Employee role gets basic permissions
  // Supervisor adds approval permissions
  // HR Admin adds employee management
  // System Admin gets all permissions
};
```

### Seed 2: Philippine Holidays 2025

**File:** `seeds/002_holidays.js`

```javascript
exports.seed = async function(knex) {
  await knex('holidays').del();
  
  await knex('holidays').insert([
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'Regular' },
    { date: '2025-04-09', name: 'Araw ng Kagitingan', type: 'Regular' },
    { date: '2025-04-17', name: 'Maundy Thursday', type: 'Regular' },
    { date: '2025-04-18', name: 'Good Friday', type: 'Regular' },
    { date: '2025-05-01', name: 'Labor Day', type: 'Regular' },
    { date: '2025-06-12', name: 'Independence Day', type: 'Regular' },
    { date: '2025-08-25', name: 'Ninoy Aquino Day', type: 'Special' },
    { date: '2025-08-31', name: 'National Heroes Day', type: 'Regular' },
    { date: '2025-11-01', name: 'All Saints\' Day', type: 'Special' },
    { date: '2025-11-30', name: 'Bonifacio Day', type: 'Regular' },
    { date: '2025-12-25', name: 'Christmas Day', type: 'Regular' },
    { date: '2025-12-30', name: 'Rizal Day', type: 'Regular' },
    { date: '2025-12-31', name: 'Last Day of the Year', type: 'Special' }
  ]);
};
```

---

## Implementation Steps

1. **Install Knex CLI**
   ```bash
   npm install -g knex
   ```

2. **Initialize Knex**
   ```bash
   knex init
   ```

3. **Create Migration Files**
   ```bash
   knex migrate:make create_users_roles
   knex migrate:make create_departments_employees
   # ... create all 9 migrations
   ```

4. **Run Migrations**
   ```bash
   knex migrate:latest
   ```

5. **Create Seed Files**
   ```bash
   knex seed:make 001_roles_permissions
   knex seed:make 002_holidays
   ```

6. **Run Seeds**
   ```bash
   knex seed:run
   ```

7. **Generate ERD**
   - Use tool like pgAdmin, DBeaver, or dbdiagram.io
   - Export as PNG to docs/database-erd.png

---

## Testing Checklist

- [ ] All migrations run successfully
- [ ] All tables created with correct columns
- [ ] Foreign key constraints work correctly
- [ ] Indexes created on specified columns
- [ ] Seed data inserted successfully
- [ ] Can rollback migrations without errors
- [ ] ERD generated and saved
- [ ] Database connection pool configured
- [ ] Can query all tables successfully

---

## Definition of Done

- [ ] All 22 tables created
- [ ] All migrations have rollback scripts
- [ ] Seed data includes roles, permissions, holidays
- [ ] ERD documented
- [ ] Database connection tested
- [ ] Ready for Story 1.3 (Authentication)

---

**Next Story:** 1.3 - User Authentication System

