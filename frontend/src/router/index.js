import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    // Public routes (no layout)
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    // Error pages (public)
    {
      path: '/errors/forbidden',
      name: 'Forbidden',
      component: () => import('../views/errors/Forbidden.vue')
    },
    {
      path: '/errors/server-error',
      name: 'ServerError',
      component: () => import('../views/errors/ServerError.vue')
    },

    // Authenticated routes (with MainLayout)
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        // User Management
        {
          path: 'users',
          name: 'UserManagement',
          component: () => import('../views/admin/UserManagement.vue'),
          meta: { requiresAuth: true, requiresPermission: 'system.admin' }
        },
        {
          path: 'change-password',
          name: 'ChangePassword',
          component: () => import('../views/ChangePassword.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'SystemSettings',
          component: () => import('../views/admin/SystemSettings.vue'),
          meta: { requiresAuth: true, requiresPermission: 'system.admin' }
        },
        // Department & Employee Management
        {
          path: 'departments',
          name: 'DepartmentManagement',
          component: () => import('../views/admin/DepartmentManagement.vue'),
          meta: { requiresAuth: true, requiresPermission: 'department.read' }
        },
        {
          path: 'employees',
          name: 'EmployeeManagement',
          component: () => import('../views/admin/EmployeeManagement.vue'),
          meta: { requiresAuth: true, requiresPermission: 'employee.read_all' }
        },
        {
          path: 'holidays',
          name: 'HolidayManagement',
          component: () => import('../views/admin/HolidayManagement.vue'),
          meta: { requiresAuth: true, requiresPermission: 'system.admin' }
        },
        // Pass Slip Management
        {
          path: 'pass-slips',
          name: 'PassSlipList',
          component: () => import('../views/PassSlipList.vue'),
          meta: { requiresAuth: true, requiresPermission: 'pass_slip.read_own' }
        },
        {
          path: 'pass-slips/request',
          name: 'PassSlipRequest',
          component: () => import('../views/PassSlipRequest.vue'),
          meta: { requiresAuth: true, requiresPermission: 'pass_slip.create' }
        },
        {
          path: 'pass-slips/approvals',
          name: 'PassSlipApprovals',
          component: () => import('../views/PassSlipApprovals.vue'),
          meta: { requiresAuth: true, requiresPermission: 'pass_slip.approve' }
        },
        // Leave Management
        {
          path: 'leave',
          name: 'LeaveList',
          component: () => import('../views/LeaveList.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.read_own' }
        },
        {
          path: 'leave/request',
          name: 'LeaveRequest',
          component: () => import('../views/LeaveRequest.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.create' }
        },
        {
          path: 'leave/balance',
          name: 'LeaveBalance',
          component: () => import('../views/LeaveBalance.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.read_own' }
        },
        {
          path: 'leave/approvals',
          name: 'LeaveApprovals',
          component: () => import('../views/LeaveApprovals.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.approve' }
        },
        {
          path: 'leave/calendar',
          name: 'LeaveCalendar',
          component: () => import('../views/LeaveCalendar.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.read_own' }
        },
        {
          path: 'leave/monetization',
          name: 'LeaveMonetization',
          component: () => import('../views/LeaveMonetization.vue'),
          meta: { requiresAuth: true, requiresPermission: 'leave.configure' }
        },
        // Certificate Management
        {
          path: 'certificates/request',
          name: 'CertificateRequest',
          component: () => import('../views/CertificateRequest.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.request' }
        },
        {
          path: 'certificates/templates',
          name: 'CertificateTemplates',
          component: () => import('../views/admin/CertificateTemplates.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.manage_templates' }
        },
        {
          path: 'certificates/generate',
          name: 'CertificateGenerate',
          component: () => import('../views/admin/CertificateGenerate.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.generate' }
        },
        {
          path: 'certificates/batch',
          name: 'CertificateBatchGenerate',
          component: () => import('../views/admin/CertificateBatchGenerate.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.generate' }
        },
        {
          path: 'signatures',
          name: 'DigitalSignatures',
          component: () => import('../views/admin/DigitalSignatures.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.manage_templates' }
        },
        {
          path: 'certificates/log',
          name: 'CertificateLog',
          component: () => import('../views/admin/CertificateLog.vue'),
          meta: { requiresAuth: true, requiresPermission: 'certificate.generate' }
        },
        // Reports
        {
          path: 'reports/pass-slips',
          name: 'PassSlipReports',
          component: () => import('../views/reports/PassSlipReports.vue'),
          meta: { requiresAuth: true, requiresPermission: 'reports.view' }
        },
        {
          path: 'reports/leave',
          name: 'LeaveReports',
          component: () => import('../views/reports/LeaveReports.vue'),
          meta: { requiresAuth: true, requiresPermission: 'reports.view' }
        },
        {
          path: 'reports/certificates',
          name: 'CertificateReports',
          component: () => import('../views/reports/CertificateReports.vue'),
          meta: { requiresAuth: true, requiresPermission: 'reports.view' }
        },
        {
          path: 'reports/audit-logs',
          name: 'AuditLogViewer',
          component: () => import('../views/reports/AuditLogViewer.vue'),
          meta: { requiresAuth: true, requiresPermission: 'system.audit_log' }
        },
        {
          path: 'reports/employees',
          name: 'EmployeeReports',
          component: () => import('../views/reports/EmployeeReports.vue'),
          meta: { requiresAuth: true, requiresPermission: 'reports.view' }
        }
      ]
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/errors/NotFound.vue')
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Hydrate user if token exists but user not loaded yet
  try {
    if (authStore.isAuthenticated && !authStore.user) {
      await authStore.fetchCurrentUser()
    }
  } catch (e) {
    // ignore; api interceptor handles 401
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  if (to.meta.requiresPermission) {
    const isAdminUser = authStore.user?.username === 'admin'
    if (!isAdminUser && !authStore.hasPermission(to.meta.requiresPermission)) {
      return next('/dashboard')
    }
  }

  return next()
})

export default router

