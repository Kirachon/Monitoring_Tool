/**
 * Permissions Composable
 * Provides permission and role checking utilities for components
 */

import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  /**
   * Check if user has a specific permission
   * Reactive computed property that returns a function
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  const hasPermission = computed(() => {
    return (permission) => {
      // Admin bypass - admin user has all permissions
      if (authStore.user?.username === 'admin') return true
      return authStore.user?.permissions?.includes(permission) || false
    }
  })

  /**
   * Check if user has a specific role
   * Reactive computed property that returns a function
   * @param {string} role - Role name
   * @returns {boolean}
   */
  const hasRole = computed(() => {
    return (role) => {
      return authStore.user?.roles?.includes(role) || false
    }
  })

  /**
   * Check if user has any of the specified permissions
   * @param {Array<string>} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) return false
    return permissions.some(p => hasPermission.value(p))
  }
  
  /**
   * Check if user has all of the specified permissions
   * @param {Array<string>} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return false
    return permissions.every(p => hasPermission.value(p))
  }

  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Array of role names
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.some(r => hasRole.value(r))
  }

  /**
   * Check if user has all of the specified roles
   * @param {Array<string>} roles - Array of role names
   * @returns {boolean}
   */
  const hasAllRoles = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.every(r => hasRole.value(r))
  }

  /**
   * Computed property for checking if user is an employee
   */
  const isEmployee = computed(() => hasRole.value('Employee'))

  /**
   * Computed property for checking if user is a supervisor
   */
  const isSupervisor = computed(() => hasRole.value('Supervisor'))

  /**
   * Computed property for checking if user is an HR Administrator
   */
  const isHRAdmin = computed(() => hasRole.value('HR Administrator'))

  /**
   * Computed property for checking if user is a System Administrator
   */
  const isSysAdmin = computed(() => hasRole.value('System Administrator'))

  /**
   * Computed property for checking if user can approve requests
   */
  const canApprove = computed(() =>
    hasAnyPermission(['pass_slip.approve', 'leave.approve'])
  )

  /**
   * Computed property for checking if user can manage employees
   */
  const canManageEmployees = computed(() => hasPermission.value('employee.write'))

  /**
   * Computed property for checking if user can generate certificates
   */
  const canGenerateCertificates = computed(() => hasPermission.value('certificate.generate'))

  /**
   * Computed property for checking if user can view reports
   */
  const canViewReports = computed(() => hasPermission.value('reports.view'))

  /**
   * Computed property for checking if user has system admin access
   */
  const hasSystemAccess = computed(() => hasPermission.value('system.admin'))
  
  return {
    // Functions
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    hasAllRoles,
    
    // Computed properties
    isEmployee,
    isSupervisor,
    isHRAdmin,
    isSysAdmin,
    canApprove,
    canManageEmployees,
    canGenerateCertificates,
    canViewReports,
    hasSystemAccess
  }
}

