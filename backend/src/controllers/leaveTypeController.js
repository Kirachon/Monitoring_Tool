/**
 * Leave Type Controller
 * Handles leave type configuration HTTP requests
 */

const leaveTypeService = require('../services/leaveTypeService');
const logger = require('../config/logger');

class LeaveTypeController {
  /**
   * Get all leave types
   * GET /api/leave-types
   */
  async getLeaveTypes(req, res) {
    try {
      const activeOnly = req.query.activeOnly !== 'false';
      const leaveTypes = await leaveTypeService.getLeaveTypes(activeOnly);
      
      return res.status(200).json({
        success: true,
        data: leaveTypes
      });
    } catch (error) {
      logger.error(`Get leave types error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LEAVE_TYPES_FAILED',
          message: 'Failed to fetch leave types'
        }
      });
    }
  }

  /**
   * Get leave type by ID
   * GET /api/leave-types/:id
   */
  async getLeaveTypeById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const leaveType = await leaveTypeService.getLeaveTypeById(id);
      
      return res.status(200).json({
        success: true,
        data: leaveType
      });
    } catch (error) {
      logger.error(`Get leave type by ID error: ${error.message}`);
      
      if (error.message === 'Leave type not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'LEAVE_TYPE_NOT_FOUND',
            message: 'Leave type not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LEAVE_TYPE_FAILED',
          message: 'Failed to fetch leave type'
        }
      });
    }
  }

  /**
   * Create leave type
   * POST /api/leave-types
   */
  async createLeaveType(req, res) {
    try {
      const { name, code, accrualRate, maxBalance, requiresMedicalCert, monetizable, description } = req.body;
      
      if (!name || !code) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name and code are required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const leaveType = await leaveTypeService.createLeaveType(
        req.body,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: leaveType,
        message: 'Leave type created successfully'
      });
    } catch (error) {
      logger.error(`Create leave type error: ${error.message}`);
      
      if (error.message.includes('already exists') || error.message.includes('must be greater')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_LEAVE_TYPE_FAILED',
          message: 'Failed to create leave type'
        }
      });
    }
  }

  /**
   * Update leave type
   * PUT /api/leave-types/:id
   */
  async updateLeaveType(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const leaveType = await leaveTypeService.updateLeaveType(
        id,
        req.body,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: leaveType,
        message: 'Leave type updated successfully'
      });
    } catch (error) {
      logger.error(`Update leave type error: ${error.message}`);
      
      if (error.message === 'Leave type not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'LEAVE_TYPE_NOT_FOUND',
            message: 'Leave type not found'
          }
        });
      }
      
      if (error.message.includes('cannot be changed') || error.message.includes('must be greater')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_LEAVE_TYPE_FAILED',
          message: 'Failed to update leave type'
        }
      });
    }
  }

  /**
   * Deactivate leave type
   * DELETE /api/leave-types/:id
   */
  async deactivateLeaveType(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      await leaveTypeService.deactivateLeaveType(
        id,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Leave type deactivated successfully'
      });
    } catch (error) {
      logger.error(`Deactivate leave type error: ${error.message}`);
      
      if (error.message === 'Leave type not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'LEAVE_TYPE_NOT_FOUND',
            message: 'Leave type not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'DEACTIVATE_LEAVE_TYPE_FAILED',
          message: 'Failed to deactivate leave type'
        }
      });
    }
  }
}

module.exports = new LeaveTypeController();

