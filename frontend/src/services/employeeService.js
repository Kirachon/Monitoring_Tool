/**
 * Employee Service
 * API calls for employee management
 */

import api from './api'

export default {
  /**
   * Get all employees
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getEmployees(params = {}) {
    const response = await api.get('/employees', { params })
    // Return the full server response body so callers can use `.data` consistently
    return response.data
  },

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise}
   */
  async getEmployeeById(id) {
    const response = await api.get(`/employees/${id}`)
    return response.data?.data ?? null
  },

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise}
   */
  async createEmployee(employeeData) {
    const response = await api.post('/employees', employeeData)
    return response.data?.data ?? null
  },

  /**
   * Update employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Employee data
   * @returns {Promise}
   */
  async updateEmployee(id, employeeData) {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data?.data ?? null
  },

  /**
   * Bulk import employees
   * @param {Array} employees - Array of employee data
   * @returns {Promise}
   */
  async bulkImport(employees) {
    const response = await api.post('/employees/import', { employees })
    return response.data
  }
}

