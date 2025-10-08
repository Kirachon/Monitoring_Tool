# Story 1.4: Role-Based Access Control (RBAC)

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.4  
**Story Type:** Technical Foundation  
**Priority:** Critical  
**Estimated Effort:** 4-6 hours  
**Dependencies:** Story 1.3 (Authentication)  
**Status:** Ready for Development

---

## User Story

As a **system administrator**,  
I want **a role-based access control system that restricts features based on user roles**,  
so that **users can only access functionality appropriate to their position and responsibilities**.

---

## Acceptance Criteria

1. ✅ Four roles defined in database: Employee, Supervisor, HR Administrator, System Administrator
2. ✅ Permissions defined for each module: pass_slip.create, pass_slip.approve, leave.create, leave.approve, employee.read, employee.write, certificate.generate, reports.view, system.admin
3. ✅ Role-permission mappings established:
   - Employee: pass_slip.create, leave.create, employee.read (own record only)
   - Supervisor: All Employee permissions + pass_slip.approve, leave.approve (department only), employee.read (department only)
   - HR Administrator: All Supervisor permissions + employee.write, certificate.generate, reports.view (all)
   - System Administrator: All permissions
4. ✅ Authorization middleware checks user permissions before allowing access to protected routes
5. ✅ Frontend UI conditionally renders menu items and buttons based on user role
6. ✅ API endpoints return 403 Forbidden when user lacks required permission
7. ✅ Users can be assigned multiple roles (e.g., Supervisor + HR Administrator)
8. ✅ Permission checks log denied access attempts to audit log
9. ✅ GET /api/auth/me endpoint returns current user profile with roles and permissions
10. ✅ Role changes take effect on next login (no real-time permission updates required)

---

## Technical Specifications

### Role-Permission Matrix

| Role | Permissions |
|------|-------------|
| **Employee** | pass_slip.create, leave.create, employee.read (own) |
| **Supervisor** | Employee permissions + pass_slip.approve, leave.approve (dept), employee.read (dept) |
| **HR Administrator** | Supervisor permissions + employee.write, certificate.generate, reports.view (all) |
| **System Administrator** | All permissions + system.admin |

### Database Schema (Already created in Story 1.2)

Tables: `roles`, `permissions`, `role_permissions`, `user_roles`

### Seed Data for Roles and Permissions

```javascript
// seeds/001_roles_permissions.js
exports.seed = async function(knex) {
  // Clear existing data
  await knex('role_permissions').del();
  await knex('user_roles').del();
  await knex('permissions').del();
  await knex('roles').del();
  
  // Insert roles
  const roles = await knex('roles').insert([
    { name: 'Employee', description: 'Basic employee access' },
    { name: 'Supervisor', description: 'Department supervisor with approval rights' },
    { name: 'HR Administrator', description: 'HR staff with full employee management' },
    { name: 'System Administrator', description: 'Full system access' }
  ]).returning('*');
  
  // Insert permissions
  const permissions = await knex('permissions').insert([
    { name: 'pass_slip.create', description: 'Create pass slip requests' },
    { name: 'pass_slip.approve', description: 'Approve pass slip requests' },
    { name: 'pass_slip.view_all', description: 'View all pass slips' },
    { name: 'leave.create', description: 'Create leave requests' },
    { name: 'leave.approve', description: 'Approve leave requests' },
    { name: 'leave.view_all', description: 'View all leave requests' },
    { name: 'employee.read', description: 'View employee records' },
    { name: 'employee.write', description: 'Create/edit employee records' },
    { name: 'certificate.generate', description: 'Generate certificates' },
    { name: 'reports.view', description: 'View reports' },
    { name: 'system.admin', description: 'System administration' }
  ]).returning('*');
  
  // Map permissions to roles
  const employeeRole = roles.find(r => r.name === 'Employee');
  const supervisorRole = roles.find(r => r.name === 'Supervisor');
  const hrAdminRole = roles.find(r => r.name === 'HR Administrator');
  const sysAdminRole = roles.find(r => r.name === 'System Administrator');
  
  // Employee permissions
  await knex('role_permissions').insert([
    { role_id: employeeRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.create').id },
    { role_id: employeeRole.id, permission_id: permissions.find(p => p.name === 'leave.create').id },
    { role_id: employeeRole.id, permission_id: permissions.find(p => p.name === 'employee.read').id }
  ]);
  
  // Supervisor permissions (includes Employee permissions)
  await knex('role_permissions').insert([
    { role_id: supervisorRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.create').id },
    { role_id: supervisorRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.approve').id },
    { role_id: supervisorRole.id, permission_id: permissions.find(p => p.name === 'leave.create').id },
    { role_id: supervisorRole.id, permission_id: permissions.find(p => p.name === 'leave.approve').id },
    { role_id: supervisorRole.id, permission_id: permissions.find(p => p.name === 'employee.read').id }
  ]);
  
  // HR Admin permissions (includes Supervisor permissions)
  await knex('role_permissions').insert([
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.create').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.approve').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'pass_slip.view_all').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'leave.create').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'leave.approve').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'leave.view_all').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'employee.read').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'employee.write').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'certificate.generate').id },
    { role_id: hrAdminRole.id, permission_id: permissions.find(p => p.name === 'reports.view').id }
  ]);
  
  // System Admin gets all permissions
  for (const permission of permissions) {
    await knex('role_permissions').insert({
      role_id: sysAdminRole.id,
      permission_id: permission.id
    });
  }
};
```

---

## Backend Implementation

### Authorization Middleware (src/middleware/authorize.js)

```javascript
const logger = require('../config/logger');

module.exports = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      logger.warn(`Access denied for user ${req.user.username} to permission ${requiredPermission}`);
      
      // Log to audit log
      // auditLogService.log({
      //   user_id: req.user.userId,
      //   action: 'ACCESS_DENIED',
      //   module: 'Authorization',
      //   details: { permission: requiredPermission }
      // });
      
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
    
    next();
  };
};
```

### Usage in Routes

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const employeeController = require('../controllers/employeeController');

// Public routes
router.post('/login', authController.login);

// Protected routes - require authentication
router.use(auth);

// Employee routes - require specific permissions
router.get('/employees', 
  authorize('employee.read'), 
  employeeController.list
);

router.post('/employees', 
  authorize('employee.write'), 
  employeeController.create
);

router.put('/employees/:id', 
  authorize('employee.write'), 
  employeeController.update
);

// Pass slip approval - requires approval permission
router.post('/pass-slips/:id/approve', 
  authorize('pass_slip.approve'), 
  passSlipController.approve
);

// Certificate generation - requires certificate permission
router.post('/certificates', 
  authorize('certificate.generate'), 
  certificateController.generate
);

module.exports = router;
```

---

## Frontend Implementation

### Permission Composable (src/composables/usePermissions.js)

```javascript
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

export function usePermissions() {
  const authStore = useAuthStore()
  
  const hasPermission = (permission) => {
    return authStore.user?.permissions?.includes(permission) || false
  }
  
  const hasRole = (role) => {
    return authStore.user?.roles?.includes(role) || false
  }
  
  const hasAnyPermission = (permissions) => {
    return permissions.some(p => hasPermission(p))
  }
  
  const hasAllPermissions = (permissions) => {
    return permissions.every(p => hasPermission(p))
  }
  
  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions
  }
}
```

### Conditional Rendering in Components

```vue
<template>
  <v-container>
    <!-- Show to all authenticated users -->
    <v-btn @click="viewDashboard">Dashboard</v-btn>
    
    <!-- Show only to users with pass_slip.create permission -->
    <v-btn 
      v-if="hasPermission('pass_slip.create')"
      @click="createPassSlip"
    >
      Request Pass Slip
    </v-btn>
    
    <!-- Show only to supervisors and above -->
    <v-btn 
      v-if="hasPermission('pass_slip.approve')"
      @click="viewApprovals"
    >
      Pending Approvals
    </v-btn>
    
    <!-- Show only to HR Administrators -->
    <v-btn 
      v-if="hasPermission('employee.write')"
      @click="manageEmployees"
    >
      Manage Employees
    </v-btn>
    
    <!-- Show only to System Administrators -->
    <v-btn 
      v-if="hasPermission('system.admin')"
      @click="systemSettings"
    >
      System Settings
    </v-btn>
  </v-container>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission, hasRole } = usePermissions()
</script>
```

### Navigation Menu with Role-Based Items

```vue
<template>
  <v-navigation-drawer>
    <v-list>
      <!-- Dashboard - visible to all -->
      <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard">
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      
      <!-- Pass Slips - visible to all -->
      <v-list-item to="/pass-slips" prepend-icon="mdi-file-document">
        <v-list-item-title>Pass Slips</v-list-item-title>
      </v-list-item>
      
      <!-- Leave - visible to all -->
      <v-list-item to="/leave" prepend-icon="mdi-calendar">
        <v-list-item-title>Leave</v-list-item-title>
      </v-list-item>
      
      <!-- Approvals - visible to supervisors and above -->
      <v-list-item 
        v-if="hasAnyPermission(['pass_slip.approve', 'leave.approve'])"
        to="/approvals" 
        prepend-icon="mdi-check-circle"
      >
        <v-list-item-title>Approvals</v-list-item-title>
      </v-list-item>
      
      <!-- Employees - visible to HR Admin and above -->
      <v-list-item 
        v-if="hasPermission('employee.write')"
        to="/employees" 
        prepend-icon="mdi-account-multiple"
      >
        <v-list-item-title>Employees</v-list-item-title>
      </v-list-item>
      
      <!-- Certificates - visible to HR Admin and above -->
      <v-list-item 
        v-if="hasPermission('certificate.generate')"
        to="/certificates" 
        prepend-icon="mdi-certificate"
      >
        <v-list-item-title>Certificates</v-list-item-title>
      </v-list-item>
      
      <!-- Reports - visible to HR Admin and above -->
      <v-list-item 
        v-if="hasPermission('reports.view')"
        to="/reports" 
        prepend-icon="mdi-chart-bar"
      >
        <v-list-item-title>Reports</v-list-item-title>
      </v-list-item>
      
      <!-- System Settings - visible to System Admin only -->
      <v-list-item 
        v-if="hasPermission('system.admin')"
        to="/settings" 
        prepend-icon="mdi-cog"
      >
        <v-list-item-title>System Settings</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission, hasAnyPermission } = usePermissions()
</script>
```

---

## Testing Checklist

- [ ] Roles seeded correctly in database
- [ ] Permissions seeded correctly
- [ ] Role-permission mappings correct
- [ ] Authorization middleware blocks unauthorized access
- [ ] 403 Forbidden returned for insufficient permissions
- [ ] Frontend conditionally renders based on permissions
- [ ] Navigation menu shows/hides items correctly
- [ ] Multiple roles work correctly
- [ ] Permission changes take effect on next login
- [ ] Denied access logged to audit log

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Roles and permissions seeded
- [ ] Authorization middleware implemented
- [ ] Frontend permission composable created
- [ ] UI conditionally renders based on permissions
- [ ] Tests passing
- [ ] Ready for Story 1.5 (User Management)

---

**Next Story:** 1.5 - User Management Interface

