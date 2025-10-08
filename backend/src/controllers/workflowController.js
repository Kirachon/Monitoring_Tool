/**
 * Workflow Controller
 * Handles approval workflow configuration HTTP requests
 */

const workflowService = require('../services/workflowService');
const logger = require('../config/logger');

class WorkflowController {
  /**
   * Get workflow configuration
   * GET /api/workflows/:entityType/:departmentId
   */
  async getWorkflow(req, res) {
    try {
      const { entityType, departmentId } = req.params;
      
      const workflow = await workflowService.getWorkflow(parseInt(departmentId), entityType);
      
      return res.status(200).json({
        success: true,
        data: workflow
      });
    } catch (error) {
      logger.error(`Get workflow error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_WORKFLOW_FAILED',
          message: 'Failed to fetch workflow configuration'
        }
      });
    }
  }

  /**
   * Get all workflows
   * GET /api/workflows
   */
  async getAllWorkflows(req, res) {
    try {
      const workflows = await workflowService.getAllWorkflows();
      
      return res.status(200).json({
        success: true,
        data: workflows
      });
    } catch (error) {
      logger.error(`Get all workflows error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_WORKFLOWS_FAILED',
          message: 'Failed to fetch workflows'
        }
      });
    }
  }

  /**
   * Save workflow configuration
   * PUT /api/workflows/:entityType/:departmentId
   */
  async saveWorkflow(req, res) {
    try {
      const { entityType, departmentId } = req.params;
      const { workflowConfig } = req.body;
      
      if (!workflowConfig || !Array.isArray(workflowConfig)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Workflow configuration is required and must be an array'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const workflow = await workflowService.saveWorkflow(
        parseInt(departmentId),
        entityType,
        workflowConfig,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: workflow,
        message: 'Workflow configuration saved successfully'
      });
    } catch (error) {
      logger.error(`Save workflow error: ${error.message}`);
      
      if (error.message.includes('at least one') || error.message.includes('cannot exceed')) {
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
          code: 'SAVE_WORKFLOW_FAILED',
          message: 'Failed to save workflow configuration'
        }
      });
    }
  }

  /**
   * Delete workflow configuration
   * DELETE /api/workflows/:entityType/:departmentId
   */
  async deleteWorkflow(req, res) {
    try {
      const { entityType, departmentId } = req.params;
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      await workflowService.deleteWorkflow(
        parseInt(departmentId),
        entityType,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Workflow configuration deleted successfully'
      });
    } catch (error) {
      logger.error(`Delete workflow error: ${error.message}`);
      
      if (error.message === 'Workflow not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: 'Workflow not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_WORKFLOW_FAILED',
          message: 'Failed to delete workflow configuration'
        }
      });
    }
  }
}

module.exports = new WorkflowController();

