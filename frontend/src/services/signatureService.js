/**
 * Digital Signature Service
 * API calls for digital signature management
 */

import api from './api'

export default {
  async getSignatures() {
    const response = await api.get('/signatures')
    return response.data
  },

  async getSignatureByEmployeeId(employeeId) {
    const response = await api.get(`/signatures/${employeeId}`)
    return response.data
  },

  async uploadSignature(formData) {
    const response = await api.post('/signatures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async deleteSignature(employeeId) {
    const response = await api.delete(`/signatures/${employeeId}`)
    return response.data
  }
}

