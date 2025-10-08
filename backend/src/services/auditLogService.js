/**
 * Audit Log Service
 * Handles logging of system activities for audit trail
 */

const db = require('../config/database');
const logger = require('../config/logger');

class AuditLogService {
  /**
   * Log an audit event
   * @param {Object} params - Audit log parameters
   * @param {number} params.user_id - User ID (optional)
   * @param {string} params.action - Action performed
   * @param {string} params.module - Module/feature name
   * @param {string} params.entity_type - Entity type (optional)
   * @param {number} params.entity_id - Entity ID (optional)
   * @param {Object} params.details - Additional details (optional)
   * @param {string} params.ip_address - IP address (optional)
   * @param {string} params.user_agent - User agent (optional)
   */
  async log({
    user_id = null,
    action,
    module,
    entity_type = null,
    entity_id = null,
    details = null,
    ip_address = null,
    user_agent = null
  }) {
    try {
      await db('audit_logs').insert({
        user_id,
        action,
        module,
        entity_type,
        entity_id,
        details: details ? JSON.stringify(details) : null,
        ip_address,
        user_agent,
        created_at: db.fn.now()
      });
      
      logger.info(`Audit log: ${module}.${action} by user ${user_id || 'system'}`);
    } catch (error) {
      logger.error(`Failed to create audit log: ${error.message}`);
      // Don't throw error - audit logging should not break application flow
    }
  }
  
  /**
   * Log authentication event
   */
  async logAuth(userId, action, ipAddress, userAgent, details = null) {
    return this.log({
      user_id: userId,
      action,
      module: 'Authentication',
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Log authorization denial
   */
  async logAccessDenied(userId, permission, ipAddress, userAgent) {
    return this.log({
      user_id: userId,
      action: 'ACCESS_DENIED',
      module: 'Authorization',
      details: { permission },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Log entity creation
   */
  async logCreate(userId, module, entityType, entityId, details = null, ipAddress = null, userAgent = null) {
    return this.log({
      user_id: userId,
      action: 'CREATE',
      module,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Log entity update
   */
  async logUpdate(userId, module, entityType, entityId, details = null, ipAddress = null, userAgent = null) {
    return this.log({
      user_id: userId,
      action: 'UPDATE',
      module,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Log entity deletion
   */
  async logDelete(userId, module, entityType, entityId, details = null, ipAddress = null, userAgent = null) {
    return this.log({
      user_id: userId,
      action: 'DELETE',
      module,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Log approval action
   */
  async logApproval(userId, module, entityType, entityId, approved, comments = null, ipAddress = null, userAgent = null) {
    return this.log({
      user_id: userId,
      action: approved ? 'APPROVE' : 'DENY',
      module,
      entity_type: entityType,
      entity_id: entityId,
      details: { comments },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
  
  /**
   * Get audit logs with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>}
   */
  async getLogs(filters = {}) {
    try {
      let query = db('audit_logs')
        .leftJoin('users', 'audit_logs.user_id', 'users.id')
        .select(
          'audit_logs.*',
          'users.username'
        )
        .orderBy('audit_logs.created_at', 'desc');
      
      if (filters.user_id) {
        query = query.where('audit_logs.user_id', filters.user_id);
      }
      
      if (filters.module) {
        query = query.where('audit_logs.module', filters.module);
      }
      
      if (filters.action) {
        query = query.where('audit_logs.action', filters.action);
      }
      
      if (filters.entity_type) {
        query = query.where('audit_logs.entity_type', filters.entity_type);
      }
      
      if (filters.date_from) {
        query = query.where('audit_logs.created_at', '>=', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.where('audit_logs.created_at', '<=', filters.date_to);
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      return await query;
    } catch (error) {
      logger.error(`Failed to retrieve audit logs: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuditLogService();

