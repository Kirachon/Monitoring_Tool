/**
 * Leave Credit Controller
 * Handles leave credit HTTP requests
 */

const leaveCreditService = require('../services/leaveCreditService');
const logger = require('../config/logger');

class LeaveCreditController {
  /**
   * Get leave balances
   * GET /api/leave-credits/balances/:employeeId
   */
  async getLeaveBalances(req, res) {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const balances = await leaveCreditService.getLeaveBalances(employeeId);
      
      return res.status(200).json({
        success: true,
        data: balances
      });
    } catch (error) {
      logger.error(`Get leave balances error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_BALANCES_FAILED',
          message: 'Failed to fetch leave balances'
        }
      });
    }
  }

  /**
   * Get leave credit history
   * GET /api/leave-credits/history/:employeeId
   */
  async getLeaveCredits(req, res) {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const leaveTypeId = req.query.leaveTypeId ? parseInt(req.query.leaveTypeId) : null;
      
      const credits = await leaveCreditService.getLeaveCredits(employeeId, leaveTypeId);
      
      return res.status(200).json({
        success: true,
        data: credits
      });
    } catch (error) {
      logger.error(`Get leave credits error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CREDITS_FAILED',
          message: 'Failed to fetch leave credits'
        }
      });
    }
  }

  /**
   * Adjust leave credits
   * POST /api/leave-credits/adjust
   */
  async adjustLeaveCredits(req, res) {
    try {
      const { employeeId, leaveTypeId, amount, reason } = req.body;
      
      if (!employeeId || !leaveTypeId || amount === undefined || !reason) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Employee ID, leave type ID, amount, and reason are required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const result = await leaveCreditService.adjustLeaveCredits(
        employeeId,
        leaveTypeId,
        amount,
        reason,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Leave credits adjusted successfully'
      });
    } catch (error) {
      logger.error(`Adjust leave credits error: ${error.message}`);
      
      if (error.message.includes('not found') || error.message.includes('negative balance')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ADJUSTMENT_FAILED',
            message: error.message
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'ADJUSTMENT_FAILED',
          message: 'Failed to adjust leave credits'
        }
      });
    }
  }

  /**
   * Process monthly accrual
   * POST /api/leave-credits/process-accrual
   */
  async processMonthlyAccrual(req, res) {
    try {
      const result = await leaveCreditService.processMonthlyAccrual(req.user.id);
      
      return res.status(200).json({
        success: true,
        data: result,
        message: `Monthly accrual processed: ${result.processed} successful, ${result.errors} errors`
      });
    } catch (error) {
      logger.error(`Process monthly accrual error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'ACCRUAL_FAILED',
          message: 'Failed to process monthly accrual'
        }
      });
    }
  }
}

module.exports = new LeaveCreditController();

