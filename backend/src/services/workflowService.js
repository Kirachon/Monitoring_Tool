/**
 * Workflow Service
 * Business logic for approval workflow configuration
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class WorkflowService {
  /**
   * Get workflow configuration for department
   * @param {number} departmentId - Department ID
   * @param {string} entityType - Entity type (pass_slip, leave_request)
   * @returns {Promise<Object>}
   */
  async getWorkflow(departmentId, entityType) {
    try {
      const workflow = await db('approval_workflows')
        .where({ department_id: departmentId, entity_type: entityType })
        .first();
      
      if (!workflow) {
        // Return default workflow
        return {
          departmentId,
          entityType,
          workflowConfig: [
            {
              level: 1,
              approverRole: 'Supervisor',
              departmentScope: 'same',
              required: true
            }
          ]
        };
      }
      
      return {
        id: workflow.id,
        departmentId: workflow.department_id,
        entityType: workflow.entity_type,
        passSlipType: workflow.pass_slip_type,
        workflowConfig: workflow.workflow_config,
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at
      };
    } catch (error) {
      logger.error(`Get workflow error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all workflows
   * @returns {Promise<Array>}
   */
  async getAllWorkflows() {
    try {
      const workflows = await db('approval_workflows')
        .join('departments', 'approval_workflows.department_id', 'departments.id')
        .select(
          'approval_workflows.*',
          'departments.name as department_name'
        )
        .orderBy('departments.name');
      
      return workflows.map(w => ({
        id: w.id,
        departmentId: w.department_id,
        departmentName: w.department_name,
        entityType: w.entity_type,
        passSlipType: w.pass_slip_type,
        workflowConfig: w.workflow_config,
        approvalLevels: w.workflow_config.length,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      }));
    } catch (error) {
      logger.error(`Get all workflows error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create or update workflow configuration
   * @param {number} departmentId - Department ID
   * @param {string} entityType - Entity type
   * @param {Array} workflowConfig - Workflow configuration
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async saveWorkflow(departmentId, entityType, workflowConfig, userId, ipAddress, userAgent) {
    try {
      // Validate workflow config
      if (!Array.isArray(workflowConfig) || workflowConfig.length === 0) {
        throw new Error('Workflow configuration must have at least one approval level');
      }
      
      if (workflowConfig.length > 5) {
        throw new Error('Workflow configuration cannot exceed 5 approval levels');
      }
      
      // Check if workflow exists
      const existing = await db('approval_workflows')
        .where({ department_id: departmentId, entity_type: entityType })
        .first();
      
      let workflow;
      
      if (existing) {
        // Update existing workflow
        await db('approval_workflows')
          .where({ id: existing.id })
          .update({
            workflow_config: JSON.stringify(workflowConfig),
            updated_by: userId,
            updated_at: db.fn.now()
          });
        
        workflow = await db('approval_workflows').where({ id: existing.id }).first();
        
        await auditLogService.log({
          user_id: userId,
          action: 'UPDATE_WORKFLOW',
          module: 'Workflow Configuration',
          entity_type: 'approval_workflow',
          entity_id: existing.id,
          details: {
            department_id: departmentId,
            entity_type: entityType,
            workflow_config: workflowConfig
          },
          ip_address: ipAddress,
          user_agent: userAgent
        });
      } else {
        // Create new workflow
        const [id] = await db('approval_workflows').insert({
          department_id: departmentId,
          entity_type: entityType,
          workflow_config: JSON.stringify(workflowConfig),
          created_by: userId,
          updated_by: userId
        }).returning('id');
        
        workflow = await db('approval_workflows').where({ id }).first();
        
        await auditLogService.log({
          user_id: userId,
          action: 'CREATE_WORKFLOW',
          module: 'Workflow Configuration',
          entity_type: 'approval_workflow',
          entity_id: id,
          details: {
            department_id: departmentId,
            entity_type: entityType,
            workflow_config: workflowConfig
          },
          ip_address: ipAddress,
          user_agent: userAgent
        });
      }
      
      logger.info(`Workflow saved for department ${departmentId}, entity ${entityType} by user ${userId}`);
      
      return {
        id: workflow.id,
        departmentId: workflow.department_id,
        entityType: workflow.entity_type,
        workflowConfig: workflow.workflow_config,
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at
      };
    } catch (error) {
      logger.error(`Save workflow error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete workflow configuration (revert to default)
   * @param {number} departmentId - Department ID
   * @param {string} entityType - Entity type
   * @param {number} userId - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<void>}
   */
  async deleteWorkflow(departmentId, entityType, userId, ipAddress, userAgent) {
    try {
      const workflow = await db('approval_workflows')
        .where({ department_id: departmentId, entity_type: entityType })
        .first();
      
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      await db('approval_workflows')
        .where({ id: workflow.id })
        .delete();
      
      await auditLogService.log({
        user_id: userId,
        action: 'DELETE_WORKFLOW',
        module: 'Workflow Configuration',
        entity_type: 'approval_workflow',
        entity_id: workflow.id,
        details: {
          department_id: departmentId,
          entity_type: entityType
        },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Workflow deleted for department ${departmentId}, entity ${entityType} by user ${userId}`);
    } catch (error) {
      logger.error(`Delete workflow error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new WorkflowService();

