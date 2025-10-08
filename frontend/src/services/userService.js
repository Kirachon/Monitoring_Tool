/**
 * User Service
 * API calls for user management
 */

import api from './api'

export default {
  /**
   * Get all users with pagination and search
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getUsers(params = {}) {
    const response = await api.get('/users', { params })
    return response.data?.data ?? { users: [], pagination: { page: 1, perPage: 25, total: 0, totalPages: 0 } }?.data ?? { users: [], pagination: { page: 1, perPage: 25, total: 0, totalPages: 0 } }
  },
  
  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise}
   */
  async getUserById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data?.data ?? null?.data ?? null
  },
  
  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data?.data ?? null?.data ?? null
  },
  
  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data?.data ?? null
  },
  
  /**
   * Reset user password
   * @param {number} id - User ID
   * @returns {Promise}
   */
  async resetPassword(id) {
    const response = await api.post(`/users/${id}/reset-password`)
    return response.data?.data ?? null
  },
  
  /**
   * Get all roles
   * @returns {Promise}
   */
  async getRoles() {
    // This would be a separate endpoint in a real app
    // For now, return hardcoded roles
    return {
      success: true,
      data: [
        { id: 1, name: 'Employee' },
        { id: 2, name: 'Supervisor' },
        { id: 3, name: 'HR Administrator' },
        { id: 4, name: 'System Administrator' }
      ]
    }
  }
}

