# RBAC Role Matrix

This document inventories the 4 roles, their permissions (from backend/seeds/001_roles_permissions.js), expected accessible modules (based on frontend/src/router/index.js), and expected Navigation Drawer items (Enabled vs Disabled) as currently implemented (menu shows all items, disables when lacking permission; router guards still enforce access).

| Role | ID | Description | Permissions (by name) | Accessible Modules (routes) | Navigation Items (Enabled) | Navigation Items (Disabled) |
|---|---:|---|---|---|---|---|
| Employee | 1 | Basic employee access - can submit pass slips and leave requests | pass_slip.create, pass_slip.read_own, leave.create, leave.read_own, employee.read_own, certificate.request, department.read | /dashboard, /pass-slips, /pass-slips/request, /leave, /leave/request, /leave/balance, /leave/calendar | Dashboard; Pass Slips; Leave | Approvals (all); HR Management (Departments, Employees); Certificates (Templates, Generate, Log, Signatures); Reports (all); System (Users, Settings); Audit Logs |
| Supervisor | 2 | Department supervisor - can approve requests for department employees | pass_slip.create, pass_slip.read_own, pass_slip.read_all, pass_slip.approve, leave.create, leave.read_own, leave.read_all, leave.approve, employee.read_own, employee.read_all, certificate.request, department.read, reports.view | + Employee routes above; + /pass-slips/approvals; /leave/approvals; /reports/(pass-slips|leave|certificates|employees) | Dashboard; Pass Slips; Leave; Approvals (Pass Slips, Leave); Reports (Pass Slips, Leave, Certificates, Employees) | Certificates (Templates, Generate, Log, Signatures); System (Users, Settings); Audit Logs |
| HR Administrator | 3 | HR staff with full employee management and reporting capabilities | All Employee + Supervisor perms plus: pass_slip.cancel, leave.cancel, leave.configure, employee.write, certificate.generate, certificate.manage_templates, department.write, reports.export | All Employee/Supervisor routes; + /employees; /departments; /certificates/(templates|generate|log); /signatures; all /reports/* | Dashboard; Pass Slips; Leave; Approvals (Pass Slips, Leave); HR Management (Departments, Employees); Certificates (Templates, Generate, Log, Signatures); Reports (all) | System (Users, Settings); Audit Logs |
| System Administrator | 4 | Full system access including user management and system configuration | All permissions including user.read/write/delete/assign_roles, system.config, system.audit_log, system.admin | All routes including /users, /settings, /reports/audit-logs | All Navigation Items | (None) |

Notes
- Router guard uses `requiresPermission` meta per route. Admin username may bypass some checks in store getters; the guard also allows admin via username check.
- Menu shows all sections; items disabled when the user lacks permission. Attempting to navigate to disabled routes via direct URL is still blocked by router guard and backend middleware.

