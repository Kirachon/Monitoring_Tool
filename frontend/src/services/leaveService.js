/**
 * Leave Service
 * API calls for leave management
 */

import api from './api'

export default {
  async getLeaveBalance() {
    const response = await api.get('/leave/balance')
    return response.data?.data ?? {}
  },

  async getLeaveTypes() {
    const response = await api.get('/leave/types')
    return response.data?.data ?? []
  },

  async createLeaveRequest(leaveData) {
    const response = await api.post('/leave/requests', leaveData)
    return response.data?.data ?? null
  },

  async getLeaveRequests() {
    const response = await api.get('/leave/requests')
    return response.data?.data ?? []
  },

  async getPendingApprovals() {
    const response = await api.get('/leave/approvals/pending')
    return response.data?.data ?? []
  },

  async approveLeaveRequest(id) {
    const response = await api.put(`/leave/requests/${id}/approve`)
    return response.data?.data ?? null
  },

  async denyLeaveRequest(id, denialReason) {
    const response = await api.put(`/leave/requests/${id}/deny`, { denialReason })
    return response.data?.data ?? null
  },

  async getCalendar(params = {}) {
    const response = await api.get('/leave/calendar', { params })
    return response.data?.data ?? []
  },

  async exportCalendarPDF(params = {}) {
    const response = await api.get('/leave/calendar/export', { params, responseType: 'blob' })
    return response
  },

  async checkConflicts(dateFrom, dateTo) {
    const response = await api.get('/leave/conflicts', { params: { dateFrom, dateTo } })
    return response.data?.data ?? {}
  },

  async getBalances(employeeId) {
    const response = await api.get(`/leave-credits/balances/${employeeId}`)
    return response.data?.data ?? []
  },

  async getCreditHistory(employeeId, { leaveTypeId = null, from = null, to = null, transactionType = null } = {}) {
    const params = {}
    if (leaveTypeId) params.leaveTypeId = leaveTypeId
    if (from) params.from = from
    if (to) params.to = to
    if (transactionType) params.transactionType = transactionType
    const response = await api.get(`/leave-credits/history/${employeeId}`, { params })
    return response.data?.data ?? []
  },

  async cancelLeaveRequest(id, reason) {
    const response = await api.put(`/leave/requests/${id}/cancel`, { reason })
    return response.data?.data ?? null
  },

  async updateLeaveRequest(id, payload) {
    const response = await api.put(`/leave/requests/${id}`, payload)
    return response.data?.data ?? null
  },

  async getLeaveRequestById(id) {
    const response = await api.get(`/leave/requests/${id}`)
    return response.data?.data ?? null
  }
}

