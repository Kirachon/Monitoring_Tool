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
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return authStore.user?.permissions?.includes(permission) || false
  }
  
  /**
   * Check if user has a specific role
   * @param {string} role - Role name
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return authStore.user?.roles?.includes(role) || false
  }
  
  /**
   * Check if user has any of the specified permissions
   * @param {Array<string>} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) return false
    return permissions.some(p => hasPermission(p))
  }
  
  /**
   * Check if user has all of the specified permissions
   * @param {Array<string>} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return false
    return permissions.every(p => hasPermission(p))
  }
  
  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Array of role names
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.some(r => hasRole(r))
  }
  
  /**
   * Check if user has all of the specified roles
   * @param {Array<string>} roles - Array of role names
   * @returns {boolean}
   */
  const hasAllRoles = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.every(r => hasRole(r))
  }
  
  /**
   * Computed property for checking if user is an employee
   */
  const isEmployee = computed(() => hasRole('Employee'))
  
  /**
   * Computed property for checking if user is a supervisor
   */
  const isSupervisor = computed(() => hasRole('Supervisor'))
  
  /**
   * Computed property for checking if user is an HR Administrator
   */
  const isHRAdmin = computed(() => hasRole('HR Administrator'))
  
  /**
   * Computed property for checking if user is a System Administrator
   */
  const isSysAdmin = computed(() => hasRole('System Administrator'))
  
  /**
   * Computed property for checking if user can approve requests
   */
  const canApprove = computed(() => 
    hasAnyPermission(['pass_slip.approve', 'leave.approve'])
  )
  
  /**
   * Computed property for checking if user can manage employees
   */
  const canManageEmployees = computed(() => hasPermission('employee.write'))
  
  /**
   * Computed property for checking if user can generate certificates
   */
  const canGenerateCertificates = computed(() => hasPermission('certificate.generate'))
  
  /**
   * Computed property for checking if user can view reports
   */
  const canViewReports = computed(() => hasPermission('reports.view'))
  
  /**
   * Computed property for checking if user has system admin access
   */
  const hasSystemAccess = computed(() => hasPermission('system.admin'))
  
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

