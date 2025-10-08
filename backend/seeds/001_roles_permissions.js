/**
 * Seed: Roles and Permissions
 * Creates the 4 system roles and their associated permissions
 */

exports.seed = async function(knex) {
  // Clear existing data (in reverse order of dependencies)
  await knex('role_permissions').del();
  await knex('user_roles').del();
  await knex('permissions').del();
  await knex('roles').del();
  
  // Insert roles
  const roles = await knex('roles').insert([
    { 
      id: 1,
      name: 'Employee', 
      description: 'Basic employee access - can submit pass slips and leave requests'
    },
    { 
      id: 2,
      name: 'Supervisor', 
      description: 'Department supervisor - can approve requests for department employees'
    },
    { 
      id: 3,
      name: 'HR Administrator', 
      description: 'HR staff with full employee management and reporting capabilities'
    },
    { 
      id: 4,
      name: 'System Administrator', 
      description: 'Full system access including user management and system configuration'
    }
  ]).returning('id');
  
  // Insert permissions
  const permissions = await knex('permissions').insert([
    // Pass Slip permissions
    { id: 1, name: 'pass_slip.create', description: 'Create pass slip requests' },
    { id: 2, name: 'pass_slip.read_own', description: 'View own pass slips' },
    { id: 3, name: 'pass_slip.read_all', description: 'View all pass slips' },
    { id: 4, name: 'pass_slip.approve', description: 'Approve pass slip requests' },
    { id: 5, name: 'pass_slip.cancel', description: 'Cancel pass slips' },
    
    // Leave permissions
    { id: 6, name: 'leave.create', description: 'Create leave requests' },
    { id: 7, name: 'leave.read_own', description: 'View own leave requests' },
    { id: 8, name: 'leave.read_all', description: 'View all leave requests' },
    { id: 9, name: 'leave.approve', description: 'Approve leave requests' },
    { id: 10, name: 'leave.cancel', description: 'Cancel leave requests' },
    { id: 11, name: 'leave.configure', description: 'Configure leave types and accrual' },
    
    // Employee permissions
    { id: 12, name: 'employee.read_own', description: 'View own employee record' },
    { id: 13, name: 'employee.read_all', description: 'View all employee records' },
    { id: 14, name: 'employee.write', description: 'Create and edit employee records' },
    { id: 15, name: 'employee.delete', description: 'Delete employee records' },
    
    // Certificate permissions
    { id: 16, name: 'certificate.request', description: 'Request certificates' },
    { id: 17, name: 'certificate.generate', description: 'Generate certificates' },
    { id: 18, name: 'certificate.manage_templates', description: 'Manage certificate templates' },
    
    // Department permissions
    { id: 19, name: 'department.read', description: 'View departments' },
    { id: 20, name: 'department.write', description: 'Create and edit departments' },
    
    // Report permissions
    { id: 21, name: 'reports.view', description: 'View reports and analytics' },
    { id: 22, name: 'reports.export', description: 'Export reports' },
    
    // User management permissions
    { id: 23, name: 'user.read', description: 'View user accounts' },
    { id: 24, name: 'user.write', description: 'Create and edit user accounts' },
    { id: 25, name: 'user.delete', description: 'Delete user accounts' },
    { id: 26, name: 'user.assign_roles', description: 'Assign roles to users' },
    
    // System permissions
    { id: 27, name: 'system.config', description: 'Configure system settings' },
    { id: 28, name: 'system.audit_log', description: 'View audit logs' },
    { id: 29, name: 'system.admin', description: 'Full system administration' }
  ]).returning('id');
  
  // Map permissions to roles
  await knex('role_permissions').insert([
    // Employee role (ID: 1) - Basic permissions
    { role_id: 1, permission_id: 1 },  // pass_slip.create
    { role_id: 1, permission_id: 2 },  // pass_slip.read_own
    { role_id: 1, permission_id: 6 },  // leave.create
    { role_id: 1, permission_id: 7 },  // leave.read_own
    { role_id: 1, permission_id: 12 }, // employee.read_own
    { role_id: 1, permission_id: 16 }, // certificate.request
    { role_id: 1, permission_id: 19 }, // department.read
    
    // Supervisor role (ID: 2) - Employee permissions + approval permissions
    { role_id: 2, permission_id: 1 },  // pass_slip.create
    { role_id: 2, permission_id: 2 },  // pass_slip.read_own
    { role_id: 2, permission_id: 3 },  // pass_slip.read_all
    { role_id: 2, permission_id: 4 },  // pass_slip.approve
    { role_id: 2, permission_id: 6 },  // leave.create
    { role_id: 2, permission_id: 7 },  // leave.read_own
    { role_id: 2, permission_id: 8 },  // leave.read_all
    { role_id: 2, permission_id: 9 },  // leave.approve
    { role_id: 2, permission_id: 12 }, // employee.read_own
    { role_id: 2, permission_id: 13 }, // employee.read_all
    { role_id: 2, permission_id: 16 }, // certificate.request
    { role_id: 2, permission_id: 19 }, // department.read
    { role_id: 2, permission_id: 21 }, // reports.view
    
    // HR Administrator role (ID: 3) - Full HR permissions
    { role_id: 3, permission_id: 1 },  // pass_slip.create
    { role_id: 3, permission_id: 2 },  // pass_slip.read_own
    { role_id: 3, permission_id: 3 },  // pass_slip.read_all
    { role_id: 3, permission_id: 4 },  // pass_slip.approve
    { role_id: 3, permission_id: 5 },  // pass_slip.cancel
    { role_id: 3, permission_id: 6 },  // leave.create
    { role_id: 3, permission_id: 7 },  // leave.read_own
    { role_id: 3, permission_id: 8 },  // leave.read_all
    { role_id: 3, permission_id: 9 },  // leave.approve
    { role_id: 3, permission_id: 10 }, // leave.cancel
    { role_id: 3, permission_id: 11 }, // leave.configure
    { role_id: 3, permission_id: 12 }, // employee.read_own
    { role_id: 3, permission_id: 13 }, // employee.read_all
    { role_id: 3, permission_id: 14 }, // employee.write
    { role_id: 3, permission_id: 16 }, // certificate.request
    { role_id: 3, permission_id: 17 }, // certificate.generate
    { role_id: 3, permission_id: 18 }, // certificate.manage_templates
    { role_id: 3, permission_id: 19 }, // department.read
    { role_id: 3, permission_id: 20 }, // department.write
    { role_id: 3, permission_id: 21 }, // reports.view
    { role_id: 3, permission_id: 22 }, // reports.export
    
    // System Administrator role (ID: 4) - All permissions
    { role_id: 4, permission_id: 1 },  // pass_slip.create
    { role_id: 4, permission_id: 2 },  // pass_slip.read_own
    { role_id: 4, permission_id: 3 },  // pass_slip.read_all
    { role_id: 4, permission_id: 4 },  // pass_slip.approve
    { role_id: 4, permission_id: 5 },  // pass_slip.cancel
    { role_id: 4, permission_id: 6 },  // leave.create
    { role_id: 4, permission_id: 7 },  // leave.read_own
    { role_id: 4, permission_id: 8 },  // leave.read_all
    { role_id: 4, permission_id: 9 },  // leave.approve
    { role_id: 4, permission_id: 10 }, // leave.cancel
    { role_id: 4, permission_id: 11 }, // leave.configure
    { role_id: 4, permission_id: 12 }, // employee.read_own
    { role_id: 4, permission_id: 13 }, // employee.read_all
    { role_id: 4, permission_id: 14 }, // employee.write
    { role_id: 4, permission_id: 15 }, // employee.delete
    { role_id: 4, permission_id: 16 }, // certificate.request
    { role_id: 4, permission_id: 17 }, // certificate.generate
    { role_id: 4, permission_id: 18 }, // certificate.manage_templates
    { role_id: 4, permission_id: 19 }, // department.read
    { role_id: 4, permission_id: 20 }, // department.write
    { role_id: 4, permission_id: 21 }, // reports.view
    { role_id: 4, permission_id: 22 }, // reports.export
    { role_id: 4, permission_id: 23 }, // user.read
    { role_id: 4, permission_id: 24 }, // user.write
    { role_id: 4, permission_id: 25 }, // user.delete
    { role_id: 4, permission_id: 26 }, // user.assign_roles
    { role_id: 4, permission_id: 27 }, // system.config
    { role_id: 4, permission_id: 28 }, // system.audit_log
    { role_id: 4, permission_id: 29 }  // system.admin
  ]);
  
  console.log('✅ Roles and permissions seeded successfully');
};

