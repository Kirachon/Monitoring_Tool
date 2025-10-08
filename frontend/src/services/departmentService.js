/**
 * Department Service
 * API calls for department management
 */

import api from './api'

export default {
  /**
   * Get all departments with hierarchy
   * @returns {Promise}
   */
  async getDepartments() {
    const response = await api.get('/departments')
    return response.data?.data ?? []
  },

  /**
   * Get department by ID
   * @param {number} id - Department ID
   * @returns {Promise}
   */
  async getDepartmentById(id) {
    const response = await api.get(`/departments/${id}`)
    return response.data?.data ?? null
  },

  /**
   * Create new department
   * @param {Object} departmentData - Department data
   * @returns {Promise}
   */
  async createDepartment(departmentData) {
    const response = await api.post('/departments', departmentData)
    return response.data?.data ?? null
  },

  /**
   * Update department
   * @param {number} id - Department ID
   * @param {Object} departmentData - Department data
   * @returns {Promise}
   */
  async updateDepartment(id, departmentData) {
    const response = await api.put(`/departments/${id}`, departmentData)
    return response.data?.data ?? null
  },

  /**
   * Delete department
   * @param {number} id - Department ID
   * @returns {Promise}
   */
  async deleteDepartment(id) {
    const response = await api.delete(`/departments/${id}`)
    return response.data?.data ?? null
  }
}

