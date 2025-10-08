import api from './api'

export default {
  async preview(payload) {
    // payload: { employeeId, retirementDate, dailyRate }
    const resp = await api.post('/leave-monetization/preview', payload)
    return resp.data
  },

  async create(payload) {
    // payload: { employeeId, retirementDate, dailyRate }
    const resp = await api.post('/leave-monetization', payload)
    return resp.data
  },

  async history(employeeId) {
    const resp = await api.get('/leave-monetization/history', { params: { employeeId } })
    return resp.data
  },

  async downloadReport(id) {
    const resp = await api.get(`/leave-monetization/${id}/report`, { responseType: 'blob' })
    return resp.data
  }
}

