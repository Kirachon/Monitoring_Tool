/**
 * Holiday Service
 * API calls for holiday management
 */

import api from './api'

export default {
  /**
   * Get holidays for a year
   * @param {number} year - Year
   * @returns {Promise}
   */
  async getHolidays(year) {
    const response = await api.get('/holidays', { params: { year } })
    return response.data
  },
  
  /**
   * Create new holiday
   * @param {Object} holidayData - Holiday data
   * @returns {Promise}
   */
  async createHoliday(holidayData) {
    const response = await api.post('/holidays', holidayData)
    return response.data
  },
  
  /**
   * Update holiday
   * @param {number} id - Holiday ID
   * @param {Object} holidayData - Holiday data
   * @returns {Promise}
   */
  async updateHoliday(id, holidayData) {
    const response = await api.put(`/holidays/${id}`, holidayData)
    return response.data
  },
  
  /**
   * Delete holiday
   * @param {number} id - Holiday ID
   * @returns {Promise}
   */
  async deleteHoliday(id) {
    const response = await api.delete(`/holidays/${id}`)
    return response.data
  }
}

