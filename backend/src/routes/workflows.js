/**
 * Workflow Routes
 * Defines routes for approval workflow configuration endpoints
 */

const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication and admin permission
router.use(authenticate);
router.use(requirePermission('system.configure'));

/**
 * GET /api/workflows
 * Get all workflow configurations
 */
router.get('/', workflowController.getAllWorkflows);

/**
 * GET /api/workflows/:entityType/:departmentId
 * Get workflow configuration for department
 */
router.get('/:entityType/:departmentId', workflowController.getWorkflow);

/**
 * PUT /api/workflows/:entityType/:departmentId
 * Save workflow configuration
 */
router.put('/:entityType/:departmentId', workflowController.saveWorkflow);

/**
 * DELETE /api/workflows/:entityType/:departmentId
 * Delete workflow configuration (revert to default)
 */
router.delete('/:entityType/:departmentId', workflowController.deleteWorkflow);

module.exports = router;

