/**
 * Leave Controller
 * Handles leave management HTTP requests
 */

const leaveService = require('../services/leaveService');
const logger = require('../config/logger');
const db = require('../config/database');

class LeaveController {
  /**
   * Get single leave request by ID
   * GET /api/leave/requests/:id
   */
  async getLeaveRequestById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const data = await leaveService.getLeaveRequestById(id)
      // Ensure current user is owner or has permission
      if (data.employeeId !== req.user.employeeId && !req.user.permissions?.includes('leave.manage')) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      }
      return res.status(200).json({ success: true, data })
    } catch (error) {
      logger.error(`Get leave request error: ${error.message}`)
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Leave request not found' } })
    }
  }

  /**
   * Get leave balance
   * GET /api/leave/balance
   */
  async getLeaveBalance(req, res) {
    try {
      const balance = await leaveService.getLeaveBalance(req.user.employeeId);
      
      return res.status(200).json({
        success: true,
        data: balance
      });
    } catch (error) {
      logger.error(`Get leave balance error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_BALANCE_FAILED',
          message: 'Failed to fetch leave balance'
        }
      });
    }
  }
  
  /**
   * Create leave request
   * POST /api/leave/requests
   */
  async createLeaveRequest(req, res) {
    try {
      const { leaveTypeId, dateFrom, dateTo, halfDay, halfDayPeriod, reason } = req.body;
      
      if (!leaveTypeId || !dateFrom || !dateTo) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Leave type, date from, and date to are required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const leaveRequest = await leaveService.createLeaveRequest(
        req.body,
        req.user.employeeId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: leaveRequest,
        message: `Leave request ${leaveRequest.referenceNo} created successfully`
      });
    } catch (error) {
      logger.error(`Create leave request error: ${error.message}`);
      
      if (error.message.includes('Insufficient') || error.message.includes('Conflict')) {
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
          code: 'CREATE_LEAVE_REQUEST_FAILED',
          message: 'Failed to create leave request'
        }
      });
    }
  }
  
  /**
   * Get leave requests
   * GET /api/leave/requests
   */
  async getLeaveRequests(req, res) {
    try {
      const { parsePagination, wrapResponse } = require('../utils/pagination');
      const { page, limit, offset } = parsePagination(req.query);

      const requests = await leaveService.getLeaveRequests(req.user.employeeId);

      if (req.query.page || req.query.limit) {
        const total = Array.isArray(requests) ? requests.length : 0;
        const items = requests.slice(offset, offset + limit);
        const body = wrapResponse(items, total, page, limit);
        return res.status(200).json({ success: true, ...body });
      }

      return res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      logger.error(`Get leave requests error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_REQUESTS_FAILED',
          message: 'Failed to fetch leave requests'
        }
      });
    }
  }
  
  /**
   * Get leave types
   * GET /api/leave/types
   */
  async getLeaveTypes(req, res) {
    try {
      const types = await leaveService.getLeaveTypes();

      return res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      logger.error(`Get leave types error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_TYPES_FAILED',
          message: 'Failed to fetch leave types'
        }
      });
    }
  }

  /**
   * Get pending leave approvals
   * GET /api/leave/approvals/pending
   */
  async getPendingApprovals(req, res) {
    try {
      const approvals = await leaveService.getPendingLeaveApprovals(req.user.employeeId);

      return res.status(200).json({
        success: true,
        data: approvals
      });
    } catch (error) {
      logger.error(`Get pending leave approvals error: ${error.message}`);

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
   * Approve leave request
   * PUT /api/leave/requests/:id/approve
   */
  async approveLeaveRequest(req, res) {
    try {
      const { id } = req.params;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';

      const result = await leaveService.approveLeaveRequest(
        parseInt(id),
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        message: 'Leave request approved successfully',
        data: result
      });
    } catch (error) {
      logger.error(`Approve leave request error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'APPROVAL_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Deny leave request
   * PUT /api/leave/requests/:id/deny
   */
  async denyLeaveRequest(req, res) {
    try {
      const { id } = req.params;
      const { denialReason } = req.body;

      if (!denialReason || denialReason.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Denial reason must be at least 10 characters'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';

      const result = await leaveService.denyLeaveRequest(
        parseInt(id),
        req.user.id,
        denialReason,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        message: 'Leave request denied successfully',
        data: result
      });
    } catch (error) {
      logger.error(`Deny leave request error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'DENIAL_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Get leave calendar
   * GET /api/leave/calendar?month=YYYY-MM&scope=me|department
   */
  async getLeaveCalendar(req, res) {
    try {
      const { month, scope } = req.query;
      const employeeId = req.user.employeeId;

      let data;
      if (scope === 'department') {
        // Resolve department via employeeId
        const emp = await db('employees').where({ id: employeeId }).first();
        if (!emp) {
          return res.status(404).json({ success: false, error: { code: 'EMPLOYEE_NOT_FOUND', message: 'Employee not found' } });
        }
        data = await leaveService.getLeaveCalendar(null, emp.department_id, month);
      } else {
        data = await leaveService.getLeaveCalendar(employeeId, null, month);
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error(`Get leave calendar error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: { code: 'FETCH_CALENDAR_FAILED', message: 'Failed to fetch leave calendar' }
      });
    }
  }

  /**
   * Get department conflicts percentage for a period
   * GET /api/leave/conflicts?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
   */
  async getDepartmentConflicts(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;
      if (!dateFrom || !dateTo) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'dateFrom and dateTo are required' }
        });
      }
      const result = await leaveService.checkDepartmentConflicts(req.user.employeeId, dateFrom, dateTo);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      logger.error(`Get conflicts error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: { code: 'FETCH_CONFLICTS_FAILED', message: 'Failed to check conflicts' }
      });
    }
  }

  /**
   * Export calendar PDF
   * GET /api/leave/calendar/export?month=YYYY-MM&scope=me|department
   */
  async exportCalendar(req, res) {
    try {
      const { month, scope } = req.query;

      // Fetch data first
      let data;
      if (scope === 'department') {
        data = await leaveService.getLeaveCalendar(null, null, month);
      } else {
        data = await leaveService.getLeaveCalendar(req.user.employeeId, null, month);
      }

      // Render simple HTML for PDF
      const html = `<!DOCTYPE html><html><head>
        <meta charset="utf-8" />
        <title>Leave Calendar ${month || ''}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head><body>
        <h1>Leave Calendar ${month || ''} (${scope === 'department' ? 'Department' : 'My'})</h1>
        <table>
          <thead><tr><th>Employee</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
          <tbody>
            ${data.map(item => `<tr>
              <td>${item.employeeName || '-'}</td>
              <td>${item.leaveTypeName}</td>
              <td>${item.dateFrom}</td>
              <td>${item.dateTo}</td>
              <td>${item.days}</td>
              <td>${item.status}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </body></html>`;

      // Generate PDF via Puppeteer
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      // Set headers
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="leave-calendar-${month || 'current'}.pdf"`,
        'Content-Length': pdfBuffer.length
      });

      // Audit log (export)
      try {
        const auditLogService = require('../services/auditLogService');
        await auditLogService.log({
          user_id: req.user.id,
          action: 'EXPORT_LEAVE_CALENDAR',
          module: 'Leave Management',
          entity_type: 'leave_calendar',
          entity_id: null,
          details: { scope: scope || 'me', month: month || null },
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'] || ''
        });
      } catch (e) { /* noop if audit logging fails here */ }

      return res.status(200).send(pdfBuffer);
    } catch (error) {
      logger.error(`Export calendar error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: { code: 'EXPORT_CALENDAR_FAILED', message: 'Failed to export calendar PDF' }
      });
    }
  }

  /**
   * Cancel leave request
   * PUT /api/leave/requests/:id/cancel
   */
  async cancelLeaveRequest(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await leaveService.cancelLeaveRequest(
        parseInt(id),
        req.user.id,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || '',
        reason
      );
      return res.status(200).json({ success: true, data: result, message: 'Leave request cancelled' });
    } catch (error) {
      logger.error(`Cancel leave request error: ${error.message}`);
      const code = error.message.includes('window') ? 400 : 500;
      return res.status(code).json({ success: false, error: { code: 'CANCEL_FAILED', message: error.message } });
    }
  }

  /**
   * Modify leave request
   * PUT /api/leave/requests/:id
   */
  async updateLeaveRequest(req, res) {
    try {
      const { id } = req.params;
      const { leaveTypeId, dateFrom, dateTo, halfDay, halfDayPeriod, reason } = req.body;
      const changes = { leaveTypeId, dateFrom, dateTo, halfDay, halfDayPeriod, reason };
      const result = await leaveService.updateLeaveRequest(
        parseInt(id),
        changes,
        req.user.id,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || ''
      );
      return res.status(200).json({ success: true, data: result, message: 'Leave request updated. Re-approval required.' });
    } catch (error) {
      logger.error(`Update leave request error: ${error.message}`);
      return res.status(400).json({ success: false, error: { code: 'UPDATE_FAILED', message: error.message } });
    }
  }
}

module.exports = new LeaveController();

