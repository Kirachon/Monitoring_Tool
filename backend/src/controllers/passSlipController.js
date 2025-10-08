/**
 * Pass Slip Controller
 * Handles pass slip HTTP requests
 */

const passSlipService = require('../services/passSlipService');
const logger = require('../config/logger');

class PassSlipController {
  /**
   * Create pass slip
   * POST /api/pass-slips
   */
  async createPassSlip(req, res) {
    try {
      const { passSlipType, date, timeOut, expectedTimeIn, destination, reason } = req.body;
      
      if (!passSlipType || !date || !timeOut || !expectedTimeIn || !destination || !reason) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'All fields are required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const passSlip = await passSlipService.createPassSlip(
        req.body,
        req.user.employeeId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: passSlip,
        message: `Pass slip ${passSlip.referenceNo} created successfully`
      });
    } catch (error) {
      logger.error(`Create pass slip error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_PASS_SLIP_FAILED',
          message: 'Failed to create pass slip'
        }
      });
    }
  }
  
  /**
   * Get pass slips
   * GET /api/pass-slips
   */
  async getPassSlips(req, res) {
    try {
      const { status, search, dateFrom, dateTo } = req.query;
      const { parsePagination, wrapResponse } = require('../utils/pagination');
      const { page, limit, offset } = parsePagination(req.query);

      const passSlips = await passSlipService.getPassSlips(
        req.user.employeeId,
        { status, search, dateFrom, dateTo }
      );

      // If pagination explicitly requested, slice in controller (minimal change)
      if (req.query.page || req.query.limit) {
        const total = Array.isArray(passSlips) ? passSlips.length : 0;
        const items = passSlips.slice(offset, offset + limit);
        const body = wrapResponse(items, total, page, limit);
        return res.status(200).json({ success: true, ...body });
      }

      return res.status(200).json({
        success: true,
        data: passSlips
      });
    } catch (error) {
      logger.error(`Get pass slips error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_PASS_SLIPS_FAILED',
          message: 'Failed to fetch pass slips'
        }
      });
    }
  }

  /**
   * Get department pass slips
   * GET /api/pass-slips/department
   */
  async getDepartmentPassSlips(req, res) {
    try {
      const { status, search, dateFrom, dateTo } = req.query;

      const passSlips = await passSlipService.getDepartmentPassSlips(
        req.user.employeeId,
        { status, search, dateFrom, dateTo }
      );

      return res.status(200).json({
        success: true,
        data: passSlips
      });
    } catch (error) {
      logger.error(`Get department pass slips error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_DEPARTMENT_PASS_SLIPS_FAILED',
          message: 'Failed to fetch department pass slips'
        }
      });
    }
  }

  /**
   * Get all pass slips (HR admin)
   * GET /api/pass-slips/all
   */
  async getAllPassSlips(req, res) {
    try {
      const { status, search, dateFrom, dateTo } = req.query;

      const passSlips = await passSlipService.getAllPassSlips(
        { status, search, dateFrom, dateTo }
      );

      return res.status(200).json({
        success: true,
        data: passSlips
      });
    } catch (error) {
      logger.error(`Get all pass slips error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ALL_PASS_SLIPS_FAILED',
          message: 'Failed to fetch all pass slips'
        }
      });
    }
  }
  
  /**
   * Get pending approvals
   * GET /api/pass-slips/approvals/pending
   */
  async getPendingApprovals(req, res) {
    try {
      const passSlips = await passSlipService.getPendingApprovals(req.user.employeeId);

      return res.status(200).json({
        success: true,
        data: passSlips
      });
    } catch (error) {
      logger.error(`Get pending approvals error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPROVALS_FAILED',
          message: 'Failed to fetch pending approvals'
        }
      });
    }
  }

  /**
   * Approve pass slip
   * PUT /api/pass-slips/:id/approve
   */
  async approvePassSlip(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const passSlip = await passSlipService.approvePassSlip(
        id,
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        data: passSlip,
        message: 'Pass slip approved successfully'
      });
    } catch (error) {
      logger.error(`Approve pass slip error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'APPROVE_FAILED',
          message: 'Failed to approve pass slip'
        }
      });
    }
  }

  /**
   * Deny pass slip
   * PUT /api/pass-slips/:id/deny
   */
  async denyPassSlip(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { denialReason } = req.body;

      if (!denialReason || denialReason.length < 10) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Denial reason must be at least 10 characters'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const passSlip = await passSlipService.denyPassSlip(
        id,
        req.user.id,
        denialReason,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        data: passSlip,
        message: 'Pass slip denied'
      });
    } catch (error) {
      logger.error(`Deny pass slip error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'DENY_FAILED',
          message: 'Failed to deny pass slip'
        }
      });
    }
  }

  /**
   * Get pass slip by ID
   * GET /api/pass-slips/:id
   */
  async getPassSlipById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const passSlip = await passSlipService.getPassSlipById(id);
      
      return res.status(200).json({
        success: true,
        data: passSlip
      });
    } catch (error) {
      logger.error(`Get pass slip by ID error: ${error.message}`);
      
      if (error.message === 'Pass slip not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PASS_SLIP_NOT_FOUND',
            message: 'Pass slip not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_PASS_SLIP_FAILED',
          message: 'Failed to fetch pass slip'
        }
      });
    }
  }

  /**
   * Record return time
   * PUT /api/pass-slips/:id/return
   */
  async recordReturn(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { actualTimeIn } = req.body;

      if (!actualTimeIn) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Actual time in is required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const passSlip = await passSlipService.recordReturn(
        id,
        actualTimeIn,
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        data: passSlip,
        message: 'Return time recorded successfully'
      });
    } catch (error) {
      logger.error(`Record return error: ${error.message}`);

      if (error.message.includes('not found') || error.message.includes('Only approved') || error.message.includes('already recorded') || error.message.includes('must be greater')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'RECORD_RETURN_FAILED',
            message: error.message
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'RECORD_RETURN_FAILED',
          message: 'Failed to record return time'
        }
      });
    }
  }

  /**
   * Get overdue pass slips
   * GET /api/pass-slips/overdue
   */
  async getOverduePassSlips(req, res) {
    try {
      const overdueSlips = await passSlipService.getOverduePassSlips(req.user.employeeId);

      return res.status(200).json({
        success: true,
        data: overdueSlips
      });
    } catch (error) {
      logger.error(`Get overdue pass slips error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_OVERDUE_FAILED',
          message: 'Failed to fetch overdue pass slips'
        }
      });
    }
  }
}

module.exports = new PassSlipController();

