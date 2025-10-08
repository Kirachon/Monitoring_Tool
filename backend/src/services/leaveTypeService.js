/**
 * Leave Type Service
 * Business logic for leave type configuration
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class LeaveTypeService {
  /**
   * Get all leave types
   * @param {boolean} activeOnly - Return only active leave types
   * @returns {Promise<Array>}
   */
  async getLeaveTypes(activeOnly = true) {
    try {
      let query = db('leave_types').select('*').orderBy('name');
      
      if (activeOnly) {
        query = query.where({ is_active: true });
      }
      
      const leaveTypes = await query;
      
      return leaveTypes.map(lt => ({
        id: lt.id,
        name: lt.name,
        code: lt.code,
        accrualRate: lt.accrual_rate,
        maxBalance: lt.max_balance,
        requiresMedicalCert: lt.requires_medical_cert,
        monetizable: lt.monetizable,
        description: lt.description,
        isActive: lt.is_active,
        createdAt: lt.created_at,
        updatedAt: lt.updated_at
      }));
    } catch (error) {
      logger.error(`Get leave types error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get leave type by ID
   * @param {number} id - Leave type ID
   * @returns {Promise<Object>}
   */
  async getLeaveTypeById(id) {
    try {
      const leaveType = await db('leave_types').where({ id }).first();
      
      if (!leaveType) {
        throw new Error('Leave type not found');
      }
      
      return {
        id: leaveType.id,
        name: leaveType.name,
        code: leaveType.code,
        accrualRate: leaveType.accrual_rate,
        maxBalance: leaveType.max_balance,
        requiresMedicalCert: leaveType.requires_medical_cert,
        monetizable: leaveType.monetizable,
        description: leaveType.description,
        isActive: leaveType.is_active,
        createdAt: leaveType.created_at,
        updatedAt: leaveType.updated_at
      };
    } catch (error) {
      logger.error(`Get leave type by ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create leave type
   * @param {Object} leaveTypeData - Leave type data
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createLeaveType(leaveTypeData, userId, ipAddress, userAgent) {
    try {
      // Validate code uniqueness
      const existing = await db('leave_types').where({ code: leaveTypeData.code }).first();
      if (existing) {
        throw new Error('Leave type code already exists');
      }
      
      // Validate accrual rate
      if (leaveTypeData.accrualRate < 0) {
        throw new Error('Accrual rate must be greater than or equal to 0');
      }
      
      const [id] = await db('leave_types').insert({
        name: leaveTypeData.name,
        code: leaveTypeData.code,
        accrual_rate: leaveTypeData.accrualRate,
        max_balance: leaveTypeData.maxBalance,
        requires_medical_cert: leaveTypeData.requiresMedicalCert,
        monetizable: leaveTypeData.monetizable,
        description: leaveTypeData.description,
        created_by: userId,
        updated_by: userId
      }).returning('id');
      
      await auditLogService.log({
        user_id: userId,
        action: 'CREATE_LEAVE_TYPE',
        module: 'Leave Type Configuration',
        entity_type: 'leave_type',
        entity_id: id,
        details: { code: leaveTypeData.code, name: leaveTypeData.name },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Leave type ${leaveTypeData.code} created by user ${userId}`);
      
      return await this.getLeaveTypeById(id);
    } catch (error) {
      logger.error(`Create leave type error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update leave type
   * @param {number} id - Leave type ID
   * @param {Object} leaveTypeData - Leave type data
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async updateLeaveType(id, leaveTypeData, userId, ipAddress, userAgent) {
    try {
      const leaveType = await db('leave_types').where({ id }).first();
      
      if (!leaveType) {
        throw new Error('Leave type not found');
      }
      
      // Code is immutable
      if (leaveTypeData.code && leaveTypeData.code !== leaveType.code) {
        throw new Error('Leave type code cannot be changed');
      }
      
      // Validate accrual rate
      if (leaveTypeData.accrualRate !== undefined && leaveTypeData.accrualRate < 0) {
        throw new Error('Accrual rate must be greater than or equal to 0');
      }
      
      await db('leave_types')
        .where({ id })
        .update({
          name: leaveTypeData.name || leaveType.name,
          accrual_rate: leaveTypeData.accrualRate !== undefined ? leaveTypeData.accrualRate : leaveType.accrual_rate,
          max_balance: leaveTypeData.maxBalance !== undefined ? leaveTypeData.maxBalance : leaveType.max_balance,
          requires_medical_cert: leaveTypeData.requiresMedicalCert !== undefined ? leaveTypeData.requiresMedicalCert : leaveType.requires_medical_cert,
          monetizable: leaveTypeData.monetizable !== undefined ? leaveTypeData.monetizable : leaveType.monetizable,
          description: leaveTypeData.description || leaveType.description,
          updated_by: userId,
          updated_at: db.fn.now()
        });
      
      await auditLogService.log({
        user_id: userId,
        action: 'UPDATE_LEAVE_TYPE',
        module: 'Leave Type Configuration',
        entity_type: 'leave_type',
        entity_id: id,
        details: { code: leaveType.code, changes: leaveTypeData },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Leave type ${id} updated by user ${userId}`);
      
      return await this.getLeaveTypeById(id);
    } catch (error) {
      logger.error(`Update leave type error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deactivate leave type (soft delete)
   * @param {number} id - Leave type ID
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<void>}
   */
  async deactivateLeaveType(id, userId, ipAddress, userAgent) {
    try {
      const leaveType = await db('leave_types').where({ id }).first();
      
      if (!leaveType) {
        throw new Error('Leave type not found');
      }
      
      await db('leave_types')
        .where({ id })
        .update({
          is_active: false,
          updated_by: userId,
          updated_at: db.fn.now()
        });
      
      await auditLogService.log({
        user_id: userId,
        action: 'DEACTIVATE_LEAVE_TYPE',
        module: 'Leave Type Configuration',
        entity_type: 'leave_type',
        entity_id: id,
        details: { code: leaveType.code, name: leaveType.name },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Leave type ${id} deactivated by user ${userId}`);
    } catch (error) {
      logger.error(`Deactivate leave type error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new LeaveTypeService();

