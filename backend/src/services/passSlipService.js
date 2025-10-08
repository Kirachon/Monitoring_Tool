/**
 * Pass Slip Service
 * Handles pass slip management operations
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class PassSlipService {
  /**
   * Generate pass slip reference number
   * @returns {Promise<string>}
   */
  async generateReferenceNo() {
    const year = new Date().getFullYear();
    const prefix = `PS-${year}-`;
    
    const lastPassSlip = await db('pass_slips')
      .where('reference_no', 'like', `${prefix}%`)
      .orderBy('reference_no', 'desc')
      .first();
    
    let sequence = 1;
    if (lastPassSlip) {
      const lastSequence = parseInt(lastPassSlip.reference_no.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }
  
  /**
   * Create pass slip request
   * @param {Object} passSlipData - Pass slip data
   * @param {number} employeeId - Employee ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createPassSlip(passSlipData, employeeId, ipAddress, userAgent) {
    try {
      const referenceNo = await this.generateReferenceNo();
      
      // Get employee's department for workflow routing
      const employee = await db('employees').where({ id: employeeId }).first();
      
      const [passSlip] = await db('pass_slips').insert({
        reference_no: referenceNo,
        employee_id: employeeId,
        pass_slip_type: passSlipData.passSlipType,
        date: passSlipData.date,
        time_out: passSlipData.timeOut,
        expected_time_in: passSlipData.expectedTimeIn,
        destination: passSlipData.destination,
        reason: passSlipData.reason,
        status: 'Pending',
        created_by: employeeId,
        updated_by: employeeId
      }).returning('*');
      
      // Create approval workflow entry
      // For now, route to department head (supervisor)
      const supervisor = await db('employees')
        .where({ department_id: employee.department_id })
        .whereNotNull('id')
        .first(); // In real scenario, find actual supervisor
      
      if (supervisor) {
        // Map supervisor employee to user account (approvals.approver_id expects users.id)
        const approverUser = await db('users').where({ employee_id: supervisor.id }).first();
        if (approverUser) {
          await db('approvals').insert({
            entity_type: 'pass_slip',
            entity_id: passSlip.id,
            approver_id: approverUser.id,
            approval_level: 1,
            action: 'Pending'
          });
        }
      }
      
      await auditLogService.logCreate(
        employeeId,
        'Pass Slip Management',
        'pass_slip',
        passSlip.id,
        { reference_no: passSlip.reference_no },
        ipAddress,
        userAgent
      );
      
      logger.info(`Pass slip ${referenceNo} created by employee ${employeeId}`);
      
      return {
        id: passSlip.id,
        referenceNo: passSlip.reference_no,
        passSlipType: passSlip.pass_slip_type,
        date: passSlip.date,
        timeOut: passSlip.time_out,
        expectedTimeIn: passSlip.expected_time_in,
        destination: passSlip.destination,
        reason: passSlip.reason,
        status: passSlip.status,
        createdAt: passSlip.created_at
      };
    } catch (error) {
      logger.error(`Create pass slip error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get pass slips for employee
   * @param {number} employeeId - Employee ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  async getPassSlips(employeeId, filters = {}) {
    try {
      let query = db('pass_slips')
        .leftJoin('employees', 'pass_slips.employee_id', 'employees.id')
        .leftJoin('users as approvers', 'pass_slips.approved_by', 'approvers.id')
        .where('pass_slips.employee_id', employeeId)
        .select(
          'pass_slips.*',
          'employees.first_name',
          'employees.last_name',
          'approvers.username as approver_name'
        )
        .orderBy('pass_slips.date', 'desc')
        .orderBy('pass_slips.created_at', 'desc');

      // Apply filters
      if (filters.status) {
        query = query.where('pass_slips.status', filters.status);
      }

      if (filters.search) {
        query = query.where(function() {
          this.where('pass_slips.destination', 'ilike', `%${filters.search}%`)
            .orWhere('pass_slips.reason', 'ilike', `%${filters.search}%`);
        });
      }

      if (filters.dateFrom) {
        query = query.where('pass_slips.date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('pass_slips.date', '<=', filters.dateTo);
      }

      const passSlips = await query;

      return passSlips.map(ps => ({
        id: ps.id,
        referenceNo: ps.reference_no,
        employeeName: `${ps.first_name} ${ps.last_name}`,
        passSlipType: ps.pass_slip_type,
        date: ps.date,
        timeOut: ps.time_out,
        expectedTimeIn: ps.expected_time_in,
        actualTimeIn: ps.actual_time_in,
        destination: ps.destination,
        reason: ps.reason,
        status: ps.status,
        approverName: ps.approver_name,
        createdAt: ps.created_at
      }));
    } catch (error) {
      logger.error(`Get pass slips error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get department pass slips for supervisor
   * @param {number} supervisorId - Supervisor employee ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  async getDepartmentPassSlips(supervisorId, filters = {}) {
    try {
      const supervisor = await db('employees').where({ id: supervisorId }).first();

      let query = db('pass_slips')
        .join('employees', 'pass_slips.employee_id', 'employees.id')
        .leftJoin('users as approvers', 'pass_slips.approved_by', 'approvers.id')
        .where('employees.department_id', supervisor.department_id)
        .select(
          'pass_slips.*',
          'employees.first_name',
          'employees.last_name',
          'approvers.username as approver_name'
        )
        .orderBy('pass_slips.date', 'desc')
        .orderBy('pass_slips.created_at', 'desc');

      // Apply filters
      if (filters.status) {
        query = query.where('pass_slips.status', filters.status);
      }

      if (filters.search) {
        query = query.where(function() {
          this.where('pass_slips.destination', 'ilike', `%${filters.search}%`)
            .orWhere('pass_slips.reason', 'ilike', `%${filters.search}%`)
            .orWhere('employees.first_name', 'ilike', `%${filters.search}%`)
            .orWhere('employees.last_name', 'ilike', `%${filters.search}%`);
        });
      }

      if (filters.dateFrom) {
        query = query.where('pass_slips.date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('pass_slips.date', '<=', filters.dateTo);
      }

      const passSlips = await query;

      return passSlips.map(ps => ({
        id: ps.id,
        referenceNo: ps.reference_no,
        employeeName: `${ps.first_name} ${ps.last_name}`,
        passSlipType: ps.pass_slip_type,
        date: ps.date,
        timeOut: ps.time_out,
        expectedTimeIn: ps.expected_time_in,
        actualTimeIn: ps.actual_time_in,
        destination: ps.destination,
        reason: ps.reason,
        status: ps.status,
        approverName: ps.approver_name,
        createdAt: ps.created_at
      }));
    } catch (error) {
      logger.error(`Get department pass slips error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all pass slips for HR admin
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  async getAllPassSlips(filters = {}) {
    try {
      let query = db('pass_slips')
        .join('employees', 'pass_slips.employee_id', 'employees.id')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .leftJoin('users as approvers', 'pass_slips.approved_by', 'approvers.id')
        .select(
          'pass_slips.*',
          'employees.first_name',
          'employees.last_name',
          'departments.name as department_name',
          'approvers.username as approver_name'
        )
        .orderBy('pass_slips.date', 'desc')
        .orderBy('pass_slips.created_at', 'desc');

      // Apply filters
      if (filters.status) {
        query = query.where('pass_slips.status', filters.status);
      }

      if (filters.search) {
        query = query.where(function() {
          this.where('pass_slips.destination', 'ilike', `%${filters.search}%`)
            .orWhere('pass_slips.reason', 'ilike', `%${filters.search}%`)
            .orWhere('employees.first_name', 'ilike', `%${filters.search}%`)
            .orWhere('employees.last_name', 'ilike', `%${filters.search}%`)
            .orWhere('departments.name', 'ilike', `%${filters.search}%`);
        });
      }

      if (filters.dateFrom) {
        query = query.where('pass_slips.date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('pass_slips.date', '<=', filters.dateTo);
      }

      const passSlips = await query;

      return passSlips.map(ps => ({
        id: ps.id,
        referenceNo: ps.reference_no,
        employeeName: `${ps.first_name} ${ps.last_name}`,
        departmentName: ps.department_name,
        passSlipType: ps.pass_slip_type,
        date: ps.date,
        timeOut: ps.time_out,
        expectedTimeIn: ps.expected_time_in,
        actualTimeIn: ps.actual_time_in,
        destination: ps.destination,
        reason: ps.reason,
        status: ps.status,
        approverName: ps.approver_name,
        createdAt: ps.created_at
      }));
    } catch (error) {
      logger.error(`Get all pass slips error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get pending approvals for supervisor
   * @param {number} supervisorId - Supervisor employee ID
   * @returns {Promise<Array>}
   */
  async getPendingApprovals(supervisorId) {
    try {
      // Map supervisor employeeId to userId for approvals.approver_id
      const approver = await db('users').where({ employee_id: supervisorId }).first();
      if (!approver) return [];

      const approvals = await db('approvals as appr')
        .join('pass_slips as ps', 'appr.entity_id', 'ps.id')
        .join('employees as e', 'ps.employee_id', 'e.id')
        .where('appr.entity_type', 'pass_slip')
        .where('appr.approver_id', approver.id)
        .where('appr.action', 'Pending')
        .select(
          'ps.*',
          'e.first_name',
          'e.last_name',
          'appr.id as approval_id'
        )
        .orderBy('ps.created_at', 'desc');

      return approvals.map(ps => ({
        id: ps.id,
        approvalId: ps.approval_id,
        referenceNo: ps.reference_no,
        employeeName: `${ps.first_name} ${ps.last_name}`,
        passSlipType: ps.pass_slip_type,
        date: ps.date,
        timeOut: ps.time_out,
        expectedTimeIn: ps.expected_time_in,
        destination: ps.destination,
        reason: ps.reason,
        createdAt: ps.created_at
      }));
    } catch (error) {
      logger.error(`Get pending approvals error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Approve pass slip
   * @param {number} id - Pass slip ID
   * @param {number} approverId - Approver employee ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async approvePassSlip(id, approverId, ipAddress, userAgent) {
    try {
      // Update approval record
      await db('approvals')
        .where({ entity_type: 'pass_slip', entity_id: id, approver_id: approverId })
        .update({
          action: 'Approved',
          approved_at: db.fn.now(),
          comments: 'Approved'
        });

      // Update pass slip status
      await db('pass_slips')
        .where({ id })
        .update({
          status: 'Approved',
          approved_by: approverId,
          approved_at: db.fn.now(),
          updated_by: approverId,
          updated_at: db.fn.now()
        });

      await auditLogService.log({
        user_id: approverId,
        action: 'APPROVE_PASS_SLIP',
        module: 'Pass Slip Management',
        entity_type: 'pass_slip',
        entity_id: id,
        details: { action: 'approved' },
        ip_address: ipAddress,
        user_agent: userAgent
      });

      logger.info(`Pass slip ${id} approved by ${approverId}`);

      return await this.getPassSlipById(id);
    } catch (error) {
      logger.error(`Approve pass slip error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deny pass slip
   * @param {number} id - Pass slip ID
   * @param {number} approverId - Approver employee ID
   * @param {string} denialReason - Denial reason
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async denyPassSlip(id, approverId, denialReason, ipAddress, userAgent) {
    try {
      // Update approval record
      await db('approvals')
        .where({ entity_type: 'pass_slip', entity_id: id, approver_id: approverId })
        .update({
          action: 'Denied',
          approved_at: db.fn.now(),
          comments: denialReason
        });

      // Update pass slip status
      await db('pass_slips')
        .where({ id })
        .update({
          status: 'Denied',
          denial_reason: denialReason,
          denied_by: approverId,
          denied_at: db.fn.now(),
          updated_by: approverId,
          updated_at: db.fn.now()
        });

      await auditLogService.log({
        user_id: approverId,
        action: 'DENY_PASS_SLIP',
        module: 'Pass Slip Management',
        entity_type: 'pass_slip',
        entity_id: id,
        details: { action: 'denied', reason: denialReason },
        ip_address: ipAddress,
        user_agent: userAgent
      });

      logger.info(`Pass slip ${id} denied by ${approverId}`);

      return await this.getPassSlipById(id);
    } catch (error) {
      logger.error(`Deny pass slip error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get pass slip by ID
   * @param {number} id - Pass slip ID
   * @returns {Promise<Object>}
   */
  async getPassSlipById(id) {
    try {
      const passSlip = await db('pass_slips')
        .leftJoin('employees', 'pass_slips.employee_id', 'employees.id')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .where('pass_slips.id', id)
        .select(
          'pass_slips.*',
          'employees.first_name',
          'employees.last_name',
          'employees.employee_id as emp_id',
          'employees.position',
          'departments.name as department_name'
        )
        .first();

      if (!passSlip) {
        throw new Error('Pass slip not found');
      }

      return {
        id: passSlip.id,
        referenceNo: passSlip.reference_no,
        employeeId: passSlip.employee_id,
        employeeName: `${passSlip.first_name} ${passSlip.last_name}`,
        empId: passSlip.emp_id,
        position: passSlip.position,
        departmentName: passSlip.department_name,
        passSlipType: passSlip.pass_slip_type,
        date: passSlip.date,
        timeOut: passSlip.time_out,
        expectedTimeIn: passSlip.expected_time_in,
        actualTimeIn: passSlip.actual_time_in,
        destination: passSlip.destination,
        reason: passSlip.reason,
        status: passSlip.status,
        createdAt: passSlip.created_at
      };
    } catch (error) {
      logger.error(`Get pass slip by ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Record return time for pass slip
   * @param {number} id - Pass slip ID
   * @param {string} actualTimeIn - Actual return time
   * @param {number} recordedBy - User ID recording the return
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async recordReturn(id, actualTimeIn, recordedBy, ipAddress, userAgent) {
    try {
      const passSlip = await db('pass_slips').where({ id }).first();

      if (!passSlip) {
        throw new Error('Pass slip not found');
      }

      if (passSlip.status !== 'Approved') {
        throw new Error('Only approved pass slips can have return time recorded');
      }

      if (passSlip.actual_time_in) {
        throw new Error('Return time already recorded');
      }

      // Validate actual time in >= time out
      const timeOut = passSlip.time_out;
      if (actualTimeIn < timeOut) {
        throw new Error('Actual time in must be greater than or equal to time out');
      }

      // Update pass slip
      await db('pass_slips')
        .where({ id })
        .update({
          actual_time_in: actualTimeIn,
          status: 'Completed',
          updated_by: recordedBy,
          updated_at: db.fn.now()
        });

      // Audit log
      await auditLogService.log({
        user_id: recordedBy,
        action: 'RECORD_RETURN',
        module: 'Pass Slip Management',
        entity_type: 'pass_slip',
        entity_id: id,
        details: {
          actual_time_in: actualTimeIn,
          reference_no: passSlip.reference_no
        },
        ip_address: ipAddress,
        user_agent: userAgent
      });

      logger.info(`Return time recorded for pass slip ${id} by user ${recordedBy}`);

      return await this.getPassSlipById(id);
    } catch (error) {
      logger.error(`Record return error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get overdue pass slips for supervisor
   * @param {number} supervisorId - Supervisor employee ID
   * @returns {Promise<Array>}
   */
  async getOverduePassSlips(supervisorId) {
    try {
      const currentTime = new Date();
      const currentDate = currentTime.toISOString().split('T')[0];
      const currentTimeStr = currentTime.toTimeString().split(' ')[0].substring(0, 5);

      // Get approved pass slips where current time > expected time in + 30 minutes and no return recorded
      const overdueSlips = await db('pass_slips')
        .join('employees', 'pass_slips.employee_id', 'employees.id')
        .join('approvals', function() {
          this.on('approvals.entity_id', '=', 'pass_slips.id')
            .andOn('approvals.entity_type', '=', db.raw('?', ['pass_slip']));
        })
        .where('approvals.approver_id', supervisorId)
        .where('pass_slips.status', 'Approved')
        .whereNull('pass_slips.actual_time_in')
        .where('pass_slips.date', '<=', currentDate)
        .select(
          'pass_slips.*',
          'employees.first_name',
          'employees.last_name'
        )
        .orderBy('pass_slips.date', 'desc')
        .orderBy('pass_slips.expected_time_in', 'desc');

      // Filter for overdue (expected_time_in + 30 minutes < current time)
      const filtered = overdueSlips.filter(ps => {
        if (ps.date < currentDate) return true; // Past date
        if (ps.date === currentDate) {
          const [hours, minutes] = ps.expected_time_in.split(':').map(Number);
          const expectedTime = new Date();
          expectedTime.setHours(hours, minutes + 30, 0, 0);
          return currentTime > expectedTime;
        }
        return false;
      });

      return filtered.map(ps => ({
        id: ps.id,
        referenceNo: ps.reference_no,
        employeeName: `${ps.first_name} ${ps.last_name}`,
        passSlipType: ps.pass_slip_type,
        date: ps.date,
        timeOut: ps.time_out,
        expectedTimeIn: ps.expected_time_in,
        destination: ps.destination,
        reason: ps.reason,
        status: 'Overdue'
      }));
    } catch (error) {
      logger.error(`Get overdue pass slips error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PassSlipService();

