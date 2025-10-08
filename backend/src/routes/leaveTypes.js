/**
 * Leave Type Routes
 * Defines routes for leave type configuration endpoints
 */

const express = require('express');
const router = express.Router();
const leaveTypeController = require('../controllers/leaveTypeController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/leave-types
 * Get all leave types
 */
router.get('/', requirePermission('leave.read'), leaveTypeController.getLeaveTypes);

/**
 * GET /api/leave-types/:id
 * Get leave type by ID
 */
router.get('/:id', requirePermission('leave.read'), leaveTypeController.getLeaveTypeById);

/**
 * POST /api/leave-types
 * Create leave type
 */
router.post('/', requirePermission('system.configure'), leaveTypeController.createLeaveType);

/**
 * PUT /api/leave-types/:id
 * Update leave type
 */
router.put('/:id', requirePermission('system.configure'), leaveTypeController.updateLeaveType);

/**
 * DELETE /api/leave-types/:id
 * Deactivate leave type
 */
router.delete('/:id', requirePermission('system.configure'), leaveTypeController.deactivateLeaveType);

module.exports = router;

