/**
 * Leave Credit Service
 * Business logic for leave credit accrual and adjustments
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class LeaveCreditService {
  /**
   * Initialize leave balances for employee
   * @param {number} employeeId - Employee ID
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  async initializeLeaveBalances(employeeId, userId) {
    try {
      // Get all active leave types
      const leaveTypes = await db('leave_types').where({ is_active: true });
      
      for (const leaveType of leaveTypes) {
        // Check if balance already exists
        const existing = await db('leave_balances')
          .where({ employee_id: employeeId, leave_type_id: leaveType.id })
          .first();
        
        if (!existing) {
          // Create initial balance
          await db('leave_balances').insert({
            employee_id: employeeId,
            leave_type_id: leaveType.id,
            current_balance: 0
          });
          
          // Create opening balance transaction
          await db('leave_credits').insert({
            employee_id: employeeId,
            leave_type_id: leaveType.id,
            amount: 0,
            transaction_type: 'Opening Balance',
            reason: 'Initial leave balance',
            balance_after: 0,
            created_by: userId
          });
        }
      }
      
      logger.info(`Leave balances initialized for employee ${employeeId}`);
    } catch (error) {
      logger.error(`Initialize leave balances error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get leave balances for employee
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Array>}
   */
  async getLeaveBalances(employeeId) {
    try {
      const balances = await db('leave_balances')
        .join('leave_types', 'leave_balances.leave_type_id', 'leave_types.id')
        .where('leave_balances.employee_id', employeeId)
        .select(
          'leave_balances.*',
          'leave_types.name as leave_type_name',
          'leave_types.code as leave_type_code',
          'leave_types.max_balance as max_balance'
        );

      // Compute YTD accruals and usage per type
      const year = new Date().getFullYear()
      const from = `${year}-01-01`
      const to = `${year}-12-31`

      const result = []
      for (const b of balances) {
        const sums = await db('leave_credits')
          .where({ employee_id: b.employee_id, leave_type_id: b.leave_type_id })
          .whereBetween('created_at', [from, to])
          .select(
            db.raw("SUM(CASE WHEN transaction_type = 'Accrual' THEN amount ELSE 0 END) as accrued"),
            db.raw("SUM(CASE WHEN transaction_type = 'Usage' THEN -amount ELSE 0 END) as used")
          )
          .first()

        result.push({
          id: b.id,
          employeeId: b.employee_id,
          leaveTypeId: b.leave_type_id,
          leaveTypeName: b.leave_type_name,
          leaveTypeCode: b.leave_type_code,
          currentBalance: parseFloat(b.current_balance),
          accruedYtd: parseFloat(sums?.accrued || 0),
          usedYtd: parseFloat(sums?.used || 0),
          maxBalance: b.max_balance != null ? parseFloat(b.max_balance) : null,
          updatedAt: b.updated_at
        })
      }

      return result;
    } catch (error) {
      logger.error(`Get leave balances error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get leave credit history for employee
   * @param {number} employeeId - Employee ID
   * @param {number} leaveTypeId - Leave type ID (optional)
   * @returns {Promise<Array>}
   */
  async getLeaveCredits(employeeId, leaveTypeId = null) {
    try {
      let query = db('leave_credits')
        .join('leave_types', 'leave_credits.leave_type_id', 'leave_types.id')
        .where('leave_credits.employee_id', employeeId)
        .select(
          'leave_credits.*',
          'leave_types.name as leave_type_name',
          'leave_types.code as leave_type_code'
        )
        .orderBy('leave_credits.created_at', 'desc');
      
      if (leaveTypeId) {
        query = query.where('leave_credits.leave_type_id', leaveTypeId);
      }
      
      const credits = await query;
      
      return credits.map(c => ({
        id: c.id,
        employeeId: c.employee_id,
        leaveTypeId: c.leave_type_id,
        leaveTypeName: c.leave_type_name,
        leaveTypeCode: c.leave_type_code,
        amount: parseFloat(c.amount),
        transactionType: c.transaction_type,
        reason: c.reason,
        balanceAfter: parseFloat(c.balance_after),
        createdAt: c.created_at
      }));
    } catch (error) {
      logger.error(`Get leave credits error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adjust leave credits manually
   * @param {number} employeeId - Employee ID
   * @param {number} leaveTypeId - Leave type ID
   * @param {number} amount - Amount to adjust (positive or negative)
   * @param {string} reason - Reason for adjustment
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async adjustLeaveCredits(employeeId, leaveTypeId, amount, reason, userId, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      // Get current balance
      const balance = await trx('leave_balances')
        .where({ employee_id: employeeId, leave_type_id: leaveTypeId })
        .first()
        .forUpdate();
      
      if (!balance) {
        throw new Error('Leave balance not found');
      }
      
      // Get leave type for max balance check
      const leaveType = await trx('leave_types').where({ id: leaveTypeId }).first();
      
      // Calculate new balance
      let newBalance = parseFloat(balance.current_balance) + parseFloat(amount);
      
      // Enforce max balance
      if (leaveType.max_balance && newBalance > leaveType.max_balance) {
        newBalance = leaveType.max_balance;
      }
      
      // Ensure balance doesn't go negative
      if (newBalance < 0) {
        throw new Error('Adjustment would result in negative balance');
      }
      
      // Update balance
      await trx('leave_balances')
        .where({ id: balance.id })
        .update({
          current_balance: newBalance,
          updated_at: trx.fn.now()
        });
      
      // Create credit transaction
      const [creditId] = await trx('leave_credits').insert({
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        amount: amount,
        transaction_type: 'Adjustment',
        reason: reason,
        balance_after: newBalance,
        created_by: userId
      }).returning('id');
      
      // Audit log
      await auditLogService.log({
        user_id: userId,
        action: 'ADJUST_LEAVE_CREDITS',
        module: 'Leave Credit Management',
        entity_type: 'leave_credit',
        entity_id: creditId,
        details: {
          employee_id: employeeId,
          leave_type_id: leaveTypeId,
          amount: amount,
          reason: reason,
          balance_after: newBalance
        },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      await trx.commit();
      
      logger.info(`Leave credits adjusted for employee ${employeeId} by user ${userId}`);
      
      return {
        employeeId,
        leaveTypeId,
        amount: parseFloat(amount),
        balanceAfter: newBalance,
        reason
      };
    } catch (error) {
      await trx.rollback();
      logger.error(`Adjust leave credits error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process monthly accrual for all employees
   * @param {number} userId - User ID (system)
   * @returns {Promise<Object>}
   */
  async processMonthlyAccrual(userId) {
    try {
      const now = new Date();
      const month = now.toLocaleString('default', { month: 'long' });
      const year = now.getFullYear();
      const reason = `Monthly Accrual - ${month} ${year}`;
      
      // Get all active employees with Regular status
      const employees = await db('employees')
        .where({ employment_status: 'Regular', is_active: true });
      
      // Get accruing leave types (VL and SL)
      const leaveTypes = await db('leave_types')
        .where({ is_active: true })
        .where('accrual_rate', '>', 0);
      
      let processed = 0;
      let errors = 0;
      
      for (const employee of employees) {
        for (const leaveType of leaveTypes) {
          try {
            await this.accrueLeaveCredits(
              employee.id,
              leaveType.id,
              leaveType.accrual_rate,
              leaveType.max_balance,
              reason,
              userId
            );
            processed++;
          } catch (error) {
            logger.error(`Accrual error for employee ${employee.id}, leave type ${leaveType.id}: ${error.message}`);
            errors++;
          }
        }
      }
      
      logger.info(`Monthly accrual processed: ${processed} successful, ${errors} errors`);
      
      return { processed, errors };
    } catch (error) {
      logger.error(`Process monthly accrual error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Accrue leave credits for employee
   * @param {number} employeeId - Employee ID
   * @param {number} leaveTypeId - Leave type ID
   * @param {number} accrualRate - Accrual rate
   * @param {number} maxBalance - Max balance
   * @param {string} reason - Reason
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  async accrueLeaveCredits(employeeId, leaveTypeId, accrualRate, maxBalance, reason, userId) {
    const trx = await db.transaction();
    
    try {
      const balance = await trx('leave_balances')
        .where({ employee_id: employeeId, leave_type_id: leaveTypeId })
        .first()
        .forUpdate();
      
      if (!balance) {
        await trx.rollback();
        return;
      }
      
      let newBalance = parseFloat(balance.current_balance) + parseFloat(accrualRate);
      
      if (maxBalance && newBalance > maxBalance) {
        newBalance = maxBalance;
      }
      
      await trx('leave_balances')
        .where({ id: balance.id })
        .update({
          current_balance: newBalance,
          updated_at: trx.fn.now()
        });
      
      await trx('leave_credits').insert({
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        amount: accrualRate,
        transaction_type: 'Accrual',
        reason: reason,
        balance_after: newBalance,
        created_by: userId
      });
      
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

module.exports = new LeaveCreditService();

