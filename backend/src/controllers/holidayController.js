/**
 * Holiday Controller
 * Handles holiday management HTTP requests
 */

const holidayService = require('../services/holidayService');
const logger = require('../config/logger');

class HolidayController {
  /**
   * Get holidays for a year
   * GET /api/holidays
   */
  async getHolidays(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      
      const holidays = await holidayService.getHolidays(year);
      
      return res.status(200).json({
        success: true,
        data: holidays
      });
    } catch (error) {
      logger.error(`Get holidays error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_HOLIDAYS_FAILED',
          message: 'Failed to fetch holidays'
        }
      });
    }
  }
  
  /**
   * Create holiday
   * POST /api/holidays
   */
  async createHoliday(req, res) {
    try {
      const { date, name, type, recurring } = req.body;
      
      if (!date || !name || !type) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Date, name, and type are required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const holiday = await holidayService.createHoliday(
        { date, name, type, recurring },
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: holiday,
        message: 'Holiday created successfully'
      });
    } catch (error) {
      logger.error(`Create holiday error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_HOLIDAY_FAILED',
          message: 'Failed to create holiday'
        }
      });
    }
  }
  
  /**
   * Update holiday
   * PUT /api/holidays/:id
   */
  async updateHoliday(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const holiday = await holidayService.updateHoliday(
        id,
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: holiday,
        message: 'Holiday updated successfully'
      });
    } catch (error) {
      logger.error(`Update holiday error: ${error.message}`);
      
      if (error.message === 'Holiday not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'HOLIDAY_NOT_FOUND',
            message: 'Holiday not found'
          }
        });
      }
      
      if (error.message === 'Cannot edit past holidays') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PAST_HOLIDAY',
            message: 'Cannot edit past holidays'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_HOLIDAY_FAILED',
          message: 'Failed to update holiday'
        }
      });
    }
  }
  
  /**
   * Delete holiday
   * DELETE /api/holidays/:id
   */
  async deleteHoliday(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      await holidayService.deleteHoliday(
        id,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Holiday deleted successfully'
      });
    } catch (error) {
      logger.error(`Delete holiday error: ${error.message}`);
      
      if (error.message === 'Holiday not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'HOLIDAY_NOT_FOUND',
            message: 'Holiday not found'
          }
        });
      }
      
      if (error.message === 'Cannot delete past holidays') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PAST_HOLIDAY',
            message: 'Cannot delete past holidays'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_HOLIDAY_FAILED',
          message: 'Failed to delete holiday'
        }
      });
    }
  }
}

module.exports = new HolidayController();

