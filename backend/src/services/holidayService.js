/**
 * Holiday Service
 * Handles holiday calendar management
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class HolidayService {
  /**
   * Get holidays for a specific year
   * @param {number} year - Year
   * @returns {Promise<Array>}
   */
  async getHolidays(year) {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const holidays = await db('holidays')
        .whereBetween('date', [startDate, endDate])
        .orderBy('date', 'asc');
      
      return holidays.map(h => ({
        id: h.id,
        date: h.date,
        name: h.name,
        type: h.type,
        recurring: h.recurring
      }));
    } catch (error) {
      logger.error(`Get holidays error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Create holiday
   * @param {Object} holidayData - Holiday data
   * @param {number} createdBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createHoliday(holidayData, createdBy, ipAddress, userAgent) {
    try {
      const [holiday] = await db('holidays').insert({
        date: holidayData.date,
        name: holidayData.name,
        type: holidayData.type,
        recurring: holidayData.recurring || false
      }).returning('*');
      
      // If recurring, create for next 5 years
      if (holidayData.recurring) {
        const baseDate = new Date(holidayData.date);
        const month = baseDate.getMonth();
        const day = baseDate.getDate();
        
        for (let i = 1; i <= 5; i++) {
          const nextYear = baseDate.getFullYear() + i;
          const nextDate = new Date(nextYear, month, day);
          
          await db('holidays').insert({
            date: nextDate.toISOString().split('T')[0],
            name: holidayData.name,
            type: holidayData.type,
            recurring: true
          });
        }
      }
      
      await auditLogService.logCreate(
        createdBy,
        'Holiday Management',
        'holiday',
        holiday.id,
        { name: holiday.name, date: holiday.date },
        ipAddress,
        userAgent
      );
      
      logger.info(`Holiday ${holiday.name} created by user ${createdBy}`);
      
      return holiday;
    } catch (error) {
      logger.error(`Create holiday error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update holiday
   * @param {number} id - Holiday ID
   * @param {Object} holidayData - Holiday data
   * @param {number} updatedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async updateHoliday(id, holidayData, updatedBy, ipAddress, userAgent) {
    try {
      const holiday = await db('holidays').where({ id }).first();
      
      if (!holiday) {
        throw new Error('Holiday not found');
      }
      
      // Check if holiday is in the past
      if (new Date(holiday.date) < new Date()) {
        throw new Error('Cannot edit past holidays');
      }
      
      await db('holidays')
        .where({ id })
        .update({
          name: holidayData.name || holiday.name,
          type: holidayData.type || holiday.type
        });
      
      await auditLogService.logUpdate(
        updatedBy,
        'Holiday Management',
        'holiday',
        id,
        holidayData,
        ipAddress,
        userAgent
      );
      
      logger.info(`Holiday ${id} updated by user ${updatedBy}`);
      
      return await db('holidays').where({ id }).first();
    } catch (error) {
      logger.error(`Update holiday error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Delete holiday
   * @param {number} id - Holiday ID
   * @param {number} deletedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<void>}
   */
  async deleteHoliday(id, deletedBy, ipAddress, userAgent) {
    try {
      const holiday = await db('holidays').where({ id }).first();
      
      if (!holiday) {
        throw new Error('Holiday not found');
      }
      
      // Check if holiday is in the future
      if (new Date(holiday.date) < new Date()) {
        throw new Error('Cannot delete past holidays');
      }
      
      await db('holidays').where({ id }).delete();
      
      await auditLogService.logDelete(
        deletedBy,
        'Holiday Management',
        'holiday',
        id,
        { name: holiday.name, date: holiday.date },
        ipAddress,
        userAgent
      );
      
      logger.info(`Holiday ${id} deleted by user ${deletedBy}`);
    } catch (error) {
      logger.error(`Delete holiday error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Check if date is a holiday
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<boolean>}
   */
  async isHoliday(date) {
    const holiday = await db('holidays').where({ date }).first();
    return !!holiday;
  }
  
  /**
   * Get working days between two dates
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<number>}
   */
  async getWorkingDays(startDate, endDate) {
    const holidays = await db('holidays')
      .whereBetween('date', [startDate, endDate])
      .pluck('date');
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];
      
      // Skip weekends and holidays
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateStr)) {
        workingDays++;
      }
    }
    
    return workingDays;
  }
}

module.exports = new HolidayService();

