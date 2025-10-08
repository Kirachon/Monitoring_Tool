/**
 * Leave Service
 * Handles leave management operations
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');
const holidayService = require('./holidayService');

class LeaveService {
  /**
   * Get leave balance for employee
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Object>}
   */
  async getLeaveBalance(employeeId) {
    try {
      const balances = await db('leave_balances')
        .join('leave_types', 'leave_balances.leave_type_id', 'leave_types.id')
        .where('leave_balances.employee_id', employeeId)
        .select(
          'leave_types.code',
          'leave_types.name',
          'leave_balances.current_balance as current_balance'
        );
      
      const result = {};
      balances.forEach(b => {
        result[b.code] = {
          name: b.name,
          balance: parseFloat(b.current_balance),
          used: 0,
          available: parseFloat(b.current_balance)
        };
      });
      
      return result;
    } catch (error) {
      logger.error(`Get leave balance error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Create leave request
   * @param {Object} leaveData - Leave request data
   * @param {number} employeeId - Employee ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createLeaveRequest(leaveData, employeeId, ipAddress, userAgent) {
    try {
      // Calculate working days
      const workingDays = await holidayService.getWorkingDays(leaveData.dateFrom, leaveData.dateTo);
      const days = leaveData.halfDay ? 0.5 : workingDays;
      
      // Check leave balance
      const balances = await this.getLeaveBalance(employeeId);
      const leaveType = await db('leave_types').where({ id: leaveData.leaveTypeId }).first();
      
      if (balances[leaveType.code] && balances[leaveType.code].available < days) {
        throw new Error(`Insufficient leave credits. Required: ${days} days, Available: ${balances[leaveType.code].available} days`);
      }
      
      // Check for conflicts
      const conflicts = await db('leave_requests')
        .where('employee_id', employeeId)
        .where('status', 'Approved')
        .where(function() {
          this.whereBetween('date_from', [leaveData.dateFrom, leaveData.dateTo])
            .orWhereBetween('date_to', [leaveData.dateFrom, leaveData.dateTo]);
        })
        .first();
      
      if (conflicts) {
        throw new Error('Conflict detected: You have an approved leave request overlapping with these dates');
      }
      
      // Generate reference number
      const year = new Date().getFullYear();
      const prefix = `LR-${year}-`;
      const lastRequest = await db('leave_requests')
        .where('reference_no', 'like', `${prefix}%`)
        .orderBy('reference_no', 'desc')
        .first();
      
      let sequence = 1;
      if (lastRequest) {
        const lastSequence = parseInt(lastRequest.reference_no.split('-')[2]);
        sequence = lastSequence + 1;
      }
      
      const referenceNo = `${prefix}${sequence.toString().padStart(4, '0')}`;
      
      // Create leave request
      const [leaveRequest] = await db('leave_requests').insert({
        reference_no: referenceNo,
        employee_id: employeeId,
        leave_type_id: leaveData.leaveTypeId,
        date_from: leaveData.dateFrom,
        date_to: leaveData.dateTo,
        num_days: days,
        is_half_day: leaveData.halfDay || false,
        half_day_period: leaveData.halfDayPeriod || null,
        reason: leaveData.reason || null,
        status: 'Pending',
        created_by: employeeId,
        updated_by: employeeId
      }).returning('*');
      
      // Create approval workflow
      const employee = await db('employees').where({ id: employeeId }).first();
      const supervisor = await db('employees')
        .where({ department_id: employee.department_id })
        .whereNotNull('id')
        .first();
      
      if (supervisor) {
        // Map supervisor employee to user account for approvals.approver_id (expects users.id)
        const approverUser = await db('users').where({ employee_id: supervisor.id }).first();
        if (approverUser) {
          await db('approvals').insert({
            entity_type: 'leave_request',
            entity_id: leaveRequest.id,
            approver_id: approverUser.id,
            approval_level: 1,
            action: 'Pending'
          });
        }
      }
      
      await auditLogService.logCreate(
        employeeId,
        'Leave Management',
        'leave_request',
        leaveRequest.id,
        { reference_no: leaveRequest.reference_no, days },
        ipAddress,
        userAgent
      );
      
      logger.info(`Leave request ${referenceNo} created by employee ${employeeId}`);
      
      return {
        id: leaveRequest.id,
        referenceNo: leaveRequest.reference_no,
        leaveTypeId: leaveRequest.leave_type_id,
        dateFrom: leaveRequest.date_from,
        dateTo: leaveRequest.date_to,
        days: leaveRequest.num_days,
        halfDay: leaveRequest.is_half_day,
        reason: leaveRequest.reason,
        status: leaveRequest.status
      };
    } catch (error) {
      logger.error(`Create leave request error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get leave requests for employee
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Array>}
   */
  async getLeaveRequests(employeeId) {
    try {
      const requests = await db('leave_requests')
        .join('leave_types', 'leave_requests.leave_type_id', 'leave_types.id')
        .where('leave_requests.employee_id', employeeId)
        .select(
          'leave_requests.*',
          'leave_types.name as leave_type_name'
        )
        .orderBy('leave_requests.created_at', 'desc');
      
      return requests.map(r => ({
        id: r.id,
        referenceNo: r.reference_no,
        leaveTypeName: r.leave_type_name,
        dateFrom: r.date_from,
        dateTo: r.date_to,
        days: r.num_days,
        halfDay: r.is_half_day,
        reason: r.reason,
        status: r.status,
        createdAt: r.created_at
      }));
    } catch (error) {
      logger.error(`Get leave requests error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get leave types
   * @returns {Promise<Array>}
   */
  async getLeaveTypes() {
    try {
      const types = await db('leave_types')
        .where('is_active', true)
        .orderBy('name', 'asc');

      return types.map(t => ({
        id: t.id,
        code: t.code,
        name: t.name,
        description: t.description,
        requiresAttachment: t.requires_medical_cert
      }));
    } catch (error) {
      logger.error(`Get leave types error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get pending leave approvals for supervisor
   * @param {number} supervisorId - Supervisor ID
   * @returns {Promise<Array>}
   */
  async getPendingLeaveApprovals(supervisorId) {
    try {
      // Map supervisor employeeId to userId for approvals.approver_id
      const approver = await db('users').where({ employee_id: supervisorId }).first();
      if (!approver) return [];

      // Get pending leave requests routed to this approver via approvals table
      const requests = await db('approvals as appr')
        .join('leave_requests as lr', 'appr.entity_id', 'lr.id')
        .join('employees as e', 'lr.employee_id', 'e.id')
        .join('leave_types as lt', 'lr.leave_type_id', 'lt.id')
        .leftJoin('leave_balances as lb', function() {
          this.on('lb.employee_id', '=', 'lr.employee_id')
              .andOn('lb.leave_type_id', '=', 'lr.leave_type_id');
        })
        .where('appr.entity_type', 'leave_request')
        .where('appr.approver_id', approver.id)
        .where('appr.action', 'Pending')
        .select(
          'lr.*',
          'e.first_name',
          'e.last_name',
          'e.employee_id as employee_number',
          'lt.name as leave_type_name',
          'lt.code as leave_type_code',
          'lb.current_balance as current_balance'
        )
        .orderBy('lr.created_at', 'desc');

      return requests.map(r => ({
        id: r.id,
        referenceNo: r.reference_no,
        employeeName: `${r.first_name} ${r.last_name}`,
        employeeNumber: r.employee_number,
        leaveTypeName: r.leave_type_name,
        leaveTypeCode: r.leave_type_code,
        dateFrom: r.date_from,
        dateTo: r.date_to,
        days: parseFloat(r.num_days),
        halfDay: r.is_half_day,
        reason: r.reason,
        currentBalance: parseFloat(r.current_balance || 0),
        status: r.status,
        createdAt: r.created_at
      }));
    } catch (error) {
      logger.error(`Get pending leave approvals error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Approve leave request
   * @param {number} id - Leave request ID
   * @param {number} approverId - Approver user ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async approveLeaveRequest(id, approverId, ipAddress, userAgent) {
    const trx = await db.transaction();

    try {
      // Get leave request
      const leaveRequest = await trx('leave_requests')
        .where({ id })
        .first();

      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }

      if (leaveRequest.status !== 'Pending') {
        throw new Error('Leave request is not pending');
      }

      // Get current balance
      const balance = await trx('leave_balances')
        .where({
          employee_id: leaveRequest.employee_id,
          leave_type_id: leaveRequest.leave_type_id
        })
        .first();

      if (!balance || balance.current_balance < leaveRequest.num_days) {
        throw new Error('Insufficient leave balance');
      }

      const balanceBefore = parseFloat(balance.current_balance);
      const balanceAfter = balanceBefore - parseFloat(leaveRequest.num_days);

      // Update leave request
      await trx('leave_requests')
        .where({ id })
        .update({
          status: 'Approved',
          approved_by: approverId,
          approved_at: db.fn.now(),
          updated_at: db.fn.now()
        });

      // Deduct balance
      await trx('leave_balances')
        .where({
          employee_id: leaveRequest.employee_id,
          leave_type_id: leaveRequest.leave_type_id
        })
        .update({
          current_balance: balanceAfter,
          updated_at: db.fn.now()
        });

      // Update approval record
      await trx('approvals')
        .where({
          entity_type: 'leave_request',
          entity_id: id
        })
        .update({
          action: 'Approved',
          approved_at: db.fn.now(),
          updated_at: db.fn.now()
        });

      // Record usage transaction
      await trx('leave_credits').insert({
        employee_id: leaveRequest.employee_id,
        leave_type_id: leaveRequest.leave_type_id,
        amount: -parseFloat(leaveRequest.num_days),
        transaction_type: 'Usage',
        reason: `Leave Approved (${leaveRequest.reference_no || 'LR'})`,
        balance_after: balanceAfter,
        created_by: approverId
      });

      // Audit log
      await auditLogService.logUpdate(
        approverId,
        'Leave Management',
        'leave_request',
        id,
        { status: 'Pending', balance: balanceBefore },
        { status: 'Approved', balance: balanceAfter },
        ipAddress,
        userAgent
      );

      await trx.commit();
      return { success: true, balanceAfter };
    } catch (error) {
      await trx.rollback();
      logger.error(`Approve leave request error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deny leave request
   * @param {number} id - Leave request ID
   * @param {number} approverId - Approver user ID
   * @param {string} denialReason - Reason for denial
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async denyLeaveRequest(id, approverId, denialReason, ipAddress, userAgent) {
    const trx = await db.transaction();

    try {
      // Get leave request
      const leaveRequest = await trx('leave_requests')
        .where({ id })
        .first();

      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }

      if (leaveRequest.status !== 'Pending') {
        throw new Error('Leave request is not pending');
      }

      // Update leave request
      await trx('leave_requests')
        .where({ id })
        .update({
          status: 'Denied',
          approved_by: approverId,
          approved_at: db.fn.now(),
          denial_reason: denialReason,
          updated_at: db.fn.now()
        });

      // Update approval record
      await trx('approvals')
        .where({
          entity_type: 'leave_request',
          entity_id: id
        })
        .update({
          action: 'Denied',
          comments: denialReason,
          approved_at: db.fn.now(),
          updated_at: db.fn.now()
        });

      // Audit log
      await auditLogService.logUpdate(
        approverId,
        'Leave Management',
        'leave_request',
        id,
        { status: 'Pending' },
        { status: 'Denied', denial_reason: denialReason },
        ipAddress,
        userAgent
      );

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      logger.error(`Deny leave request error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get leave calendar data
   * @param {number} employeeId - Employee ID (optional, for personal calendar)
   * @param {number} departmentId - Department ID (optional, for department calendar)
   * @param {string} month - Month (YYYY-MM format)
   * @returns {Promise<Array>}
   */
  async getLeaveCalendar(employeeId = null, departmentId = null, month = null) {
    try {
      const targetMonth = month || new Date().toISOString().substring(0, 7);
      const [year, monthNum] = targetMonth.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-${new Date(year, monthNum, 0).getDate()}`;

      let query = db('leave_requests')
        .join('employees', 'leave_requests.employee_id', 'employees.id')
        .join('leave_types', 'leave_requests.leave_type_id', 'leave_types.id')
        .where('leave_requests.status', 'Approved')
        .where(function() {
          this.whereBetween('leave_requests.date_from', [startDate, endDate])
            .orWhereBetween('leave_requests.date_to', [startDate, endDate])
            .orWhere(function() {
              this.where('leave_requests.date_from', '<=', startDate)
                .where('leave_requests.date_to', '>=', endDate);
            });
        })
        .select(
          'leave_requests.*',
          'employees.first_name',
          'employees.last_name',
          'leave_types.name as leave_type_name',
          'leave_types.code as leave_type_code'
        );

      if (employeeId) {
        query = query.where('leave_requests.employee_id', employeeId);
      }

      if (departmentId) {
        query = query.where('employees.department_id', departmentId);
      }

      const leaves = await query;

      return leaves.map(l => ({
        id: l.id,
        referenceNo: l.reference_no,
        employeeId: l.employee_id,
        employeeName: `${l.first_name} ${l.last_name}`,
        leaveTypeId: l.leave_type_id,
        leaveTypeName: l.leave_type_name,
        leaveTypeCode: l.leave_type_code,
        dateFrom: l.date_from,
        dateTo: l.date_to,
        days: parseFloat(l.num_days),
        halfDay: l.is_half_day,
        halfDayPeriod: l.half_day_period,
        status: l.status
      }));
    } catch (error) {
      logger.error(`Get leave calendar error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check department leave conflicts
   * @param {number} employeeId - Employee ID
   * @param {string} dateFrom - Start date
   * @param {string} dateTo - End date
   * @returns {Promise<Object>}
   */
  async checkDepartmentConflicts(employeeId, dateFrom, dateTo) {
    try {
      const employee = await db('employees').where({ id: employeeId }).first();

      // Get total employees in department
      const totalEmployees = await db('employees')
        .where({ department_id: employee.department_id, status: 'active' })
        .count('* as count')
        .first();

      // Get employees on leave during the period
      const employeesOnLeave = await db('leave_requests')
        .join('employees', 'leave_requests.employee_id', 'employees.id')
        .where('employees.department_id', employee.department_id)
        .where('leave_requests.status', 'Approved')
        .where(function() {
          this.whereBetween('leave_requests.date_from', [dateFrom, dateTo])
            .orWhereBetween('leave_requests.date_to', [dateFrom, dateTo])
            .orWhere(function() {
              this.where('leave_requests.date_from', '<=', dateFrom)
                .where('leave_requests.date_to', '>=', dateTo);
            });
        })
        .countDistinct('employees.id as count')
        .first();

      const total = parseInt(totalEmployees.count);
      const onLeave = parseInt(employeesOnLeave.count);
      const percentage = total > 0 ? (onLeave / total) * 100 : 0;

      return {
        totalEmployees: total,
        employeesOnLeave: onLeave,
        percentage: Math.round(percentage),
        hasConflict: percentage >= 50,
        warning: percentage >= 50 ? `${onLeave} employees in your department are on leave during this period. Supervisor approval required.` : null
      };
    } catch (error) {
      logger.error(`Check department conflicts error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel leave request
   * @param {number} id - Leave request ID
   * @param {number} userId - Acting user ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @param {string} reason - Cancellation reason
   */
  async cancelLeaveRequest(id, userId, ipAddress, userAgent, reason = 'Cancelled by employee') {
    const trx = await db.transaction();
    try {
      const reqRow = await trx('leave_requests').where({ id }).first();
      if (!reqRow) throw new Error('Leave request not found');

      // Enforce cutoff: cannot cancel on or after day before start (configurable, default 1 day)
      const cutoffDays = parseInt(process.env.LEAVE_CANCELLATION_CUTOFF_DAYS || '1', 10);
      const today = new Date(); today.setHours(0,0,0,0)
      const start = new Date(reqRow.date_from); start.setHours(0,0,0,0)
      const msPerDay = 24*60*60*1000
      const diffDays = Math.floor((start - today) / msPerDay)
      if (diffDays < cutoffDays) {
        throw new Error('Cancellation window has passed. Please contact HR administrator.');
      }

      if (['Cancelled', 'Denied'].includes(reqRow.status)) {
        throw new Error('Leave request is not cancellable');
      }

      // If previously approved, restore credits
      if (reqRow.status === 'Approved') {
        const balance = await trx('leave_balances')
          .where({ employee_id: reqRow.employee_id, leave_type_id: reqRow.leave_type_id })
          .first().forUpdate();
        if (!balance) throw new Error('Leave balance not found');
        const balanceAfter = parseFloat(balance.current_balance) + parseFloat(reqRow.num_days);
        await trx('leave_balances').where({ id: balance.id }).update({ current_balance: balanceAfter, updated_at: trx.fn.now() });
        await trx('leave_credits').insert({
          employee_id: reqRow.employee_id,
          leave_type_id: reqRow.leave_type_id,
          amount: parseFloat(reqRow.num_days),
          transaction_type: 'Leave Cancelled',
          reason: reason,
          balance_after: balanceAfter,
          created_by: userId
        });
      }

      // Update request status
      await trx('leave_requests').where({ id }).update({ status: 'Cancelled', updated_at: trx.fn.now() });

      // Audit log
      await auditLogService.log({
        user_id: userId,
        action: 'CANCEL_LEAVE_REQUEST',
        module: 'Leave Management',
        entity_type: 'leave_request',
        entity_id: id,
        details: { previous_status: reqRow.status, reason },
        ip_address: ipAddress,
        user_agent: userAgent
      });

      await trx.commit();
      return { id, status: 'Cancelled' };
    } catch (error) {
      await trx.rollback();
      logger.error(`Cancel leave request error: ${error.message}`);
      throw error;
    }
  }

  async getLeaveRequestById(id) {
    try {
      const row = await db('leave_requests')
        .leftJoin('leave_types', 'leave_requests.leave_type_id', 'leave_types.id')
        .select('leave_requests.*', 'leave_types.name as leave_type_name')
        .where({ 'leave_requests.id': id })
        .first();
      if (!row) throw new Error('Leave request not found');
      return {
        id: row.id,
        referenceNo: row.reference_no,
        employeeId: row.employee_id,
        leaveTypeId: row.leave_type_id,
        leaveTypeName: row.leave_type_name,
        dateFrom: row.date_from,
        dateTo: row.date_to,
        halfDay: row.is_half_day,
        halfDayPeriod: row.half_day_period,
        reason: row.reason,
        days: row.num_days,
        status: row.status
      };
    } catch (e) {
      logger.error(`Get leave request error: ${e.message}`);
      throw e;
    }
  }

  /**
   * Modify a pending leave request (resets approvals)
   */
  async updateLeaveRequest(id, changes, userId, ipAddress, userAgent) {
    const trx = await db.transaction();
    try {
      const reqRow = await trx('leave_requests').where({ id }).first();
      if (!reqRow) throw new Error('Leave request not found');
      if (reqRow.status !== 'Pending') throw new Error('Only pending leave requests can be modified');

      // Recompute days
      const workingDays = await holidayService.getWorkingDays(changes.dateFrom || reqRow.date_from, changes.dateTo || reqRow.date_to);
      const days = changes.halfDay ? 0.5 : workingDays;

      // Validate balance for new type/date
      const leaveTypeId = changes.leaveTypeId || reqRow.leave_type_id;
      const balances = await this.getLeaveBalance(reqRow.employee_id);
      const leaveType = await db('leave_types').where({ id: leaveTypeId }).first();
      const code = leaveType.code;
      if (balances[code] && balances[code].available < days) {
        throw new Error(`Insufficient leave credits for modified request. Required: ${days} days, Available: ${balances[code].available} days`);
      }

      const updated = {
        leave_type_id: leaveTypeId,
        date_from: changes.dateFrom || reqRow.date_from,
        date_to: changes.dateTo || reqRow.date_to,
        is_half_day: !!changes.halfDay,
        half_day_period: changes.halfDay ? (changes.halfDayPeriod || reqRow.half_day_period) : null,
        reason: changes.reason ?? reqRow.reason,
        num_days: days,
        updated_at: trx.fn.now()
      };

      await trx('leave_requests').where({ id }).update(updated);

      // Reset approvals
      await trx('approvals').where({ entity_type: 'leave_request', entity_id: id }).update({ status: 'Pending', comments: null, approved_at: null, updated_at: trx.fn.now() });

      // Audit log
      await auditLogService.log({
        user_id: userId,
        action: 'MODIFY_LEAVE_REQUEST',
        module: 'Leave Management',
        entity_type: 'leave_request',
        entity_id: id,
        details: { changes: updated },
        ip_address: ipAddress,
        user_agent: userAgent
      });

      await trx.commit();
      return { id, ...updated };
    } catch (error) {
      await trx.rollback();
      logger.error(`Update leave request error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new LeaveService();

