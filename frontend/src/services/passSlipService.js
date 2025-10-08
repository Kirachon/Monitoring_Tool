/**
 * Pass Slip Service
 * API calls for pass slip management
 */

import api from './api'

export default {
  /**
   * Create pass slip
   * @param {Object} passSlipData - Pass slip data
   * @returns {Promise}
   */
  async createPassSlip(passSlipData) {
    const response = await api.post('/pass-slips', passSlipData)
    return response.data
  },

  /**
   * Get pass slips
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getPassSlips(params = {}) {
    const response = await api.get('/pass-slips', { params })
    return response.data
  },

  /**
   * Get pass slip by ID
   * @param {number} id - Pass slip ID
   * @returns {Promise}
   */
  async getPassSlipById(id) {
    const response = await api.get(`/pass-slips/${id}`)
    return response.data
  },

  /**
   * Get pending approvals
   * @returns {Promise}
   */
  async getPendingApprovals() {
    const response = await api.get('/pass-slips/approvals/pending')
    return response.data
  },

  /**
   * Approve pass slip
   * @param {number} id - Pass slip ID
   * @returns {Promise}
   */
  async approvePassSlip(id) {
    const response = await api.put(`/pass-slips/${id}/approve`)
    return response.data
  },

  /**
   * Deny pass slip
   * @param {number} id - Pass slip ID
   * @param {string} denialReason - Denial reason
   * @returns {Promise}
   */
  async denyPassSlip(id, denialReason) {
    const response = await api.put(`/pass-slips/${id}/deny`, { denialReason })
    return response.data
  },

  /**
   * Record return time
   * @param {number} id - Pass slip ID
   * @param {string} actualTimeIn - Actual time in
   * @returns {Promise}
   */
  async recordReturn(id, actualTimeIn) {
    const response = await api.put(`/pass-slips/${id}/return`, { actualTimeIn })
    return response.data
  },

  /**
   * Get overdue pass slips
   * @returns {Promise}
   */
  async getOverduePassSlips() {
    const response = await api.get('/pass-slips/overdue')
    return response.data
  },

  /**
   * Get department pass slips
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getDepartmentPassSlips(params = {}) {
    const response = await api.get('/pass-slips/department', { params })
    return response.data
  },

  /**
   * Get all pass slips (HR admin)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAllPassSlips(params = {}) {
    const response = await api.get('/pass-slips/all', { params })
    return response.data
  }
}

