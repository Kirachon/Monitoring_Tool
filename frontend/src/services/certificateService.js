/**
 * Certificate Service
 * API calls for certificate management
 */

import api from './api'

export default {
  async getTemplates() {
    const response = await api.get('/certificates/templates')
    return response.data
  },

  async getTemplateById(id) {
    const response = await api.get(`/certificates/templates/${id}`)
    return response.data
  },

  async createTemplate(templateData) {
    const response = await api.post('/certificates/templates', templateData)
    return response.data
  },

  async updateTemplate(id, templateData) {
    const response = await api.put(`/certificates/templates/${id}`, templateData)
    return response.data
  },

  async duplicateTemplate(id) {
    const response = await api.post(`/certificates/templates/${id}/duplicate`)
    return response.data
  },

  async deleteTemplate(id) {
    const response = await api.delete(`/certificates/templates/${id}`)
    return response.data
  },

  async previewCertificate(data) {
    const response = await api.post('/certificates/preview', data)
    return response.data
  },

  async generateCertificate(data) {
    const response = await api.post('/certificates/generate', data)
    return response.data
  },

  async downloadCertificate(id) {
    const response = await api.get(`/certificates/${id}/download`, {
      responseType: 'blob'
    })
    return response
  },

  async getCertificates(filters) {
    const response = await api.get('/certificates', { params: filters })
    return response.data
  },

  async revokeCertificate(id, reason) {
    const response = await api.put(`/certificates/${id}/revoke`, { reason })
    return response.data
  },

  async batchGenerate(data) {
    const response = await api.post('/certificates/batch-generate', data)
    return response.data
  },

  async requestCertificate(data) {
    const response = await api.post('/certificates/request', data)
    return response.data
  },

  async getMyCertificateRequests() {
    const response = await api.get('/certificates/my-requests')
    return response.data
  }
}

