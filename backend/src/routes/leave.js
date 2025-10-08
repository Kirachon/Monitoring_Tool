/**
 * Leave Routes
 * Defines routes for leave management endpoints
 */

const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/leave/balance
 * Get leave balance for current user
 */
router.get('/balance', requirePermission('leave.read_own'), leaveController.getLeaveBalance);

/**
 * GET /api/leave/types
 * Get all leave types
 */
router.get('/types', requirePermission('leave.read_own'), leaveController.getLeaveTypes);

/**
 * POST /api/leave/requests
 * Create new leave request
 */
router.post('/requests', requirePermission('leave.create'), leaveController.createLeaveRequest);

/**
 * GET /api/leave/requests
 * Get leave requests for current user
 */
router.get('/requests', requirePermission('leave.read_own'), leaveController.getLeaveRequests);

/**
 * GET /api/leave/requests/:id
 * Get single leave request by ID
 */
router.get('/requests/:id', requirePermission('leave.read_own'), leaveController.getLeaveRequestById);

/**
 * GET /api/leave/approvals/pending
 * Get pending leave approvals for supervisor
 */
router.get('/approvals/pending', requirePermission('leave.approve'), leaveController.getPendingApprovals);

/**
 * PUT /api/leave/requests/:id/approve
 * Approve leave request
 */
router.put('/requests/:id/approve', requirePermission('leave.approve'), leaveController.approveLeaveRequest);

/**
 * PUT /api/leave/requests/:id/deny
 * Deny leave request
 */
router.put('/requests/:id/deny', requirePermission('leave.approve'), leaveController.denyLeaveRequest);

/**
 * PUT /api/leave/requests/:id/cancel
 * Cancel leave request
 */
router.put('/requests/:id/cancel', requirePermission('leave.create'), leaveController.cancelLeaveRequest);

/**
 * PUT /api/leave/requests/:id
 * Modify leave request (pending only)
 */
router.put('/requests/:id', requirePermission('leave.create'), leaveController.updateLeaveRequest);

/**
 * GET /api/leave/calendar
 * Get leave calendar for current user or department
 */
router.get('/calendar', requirePermission('leave.read_own'), leaveController.getLeaveCalendar);

/**
 * GET /api/leave/conflicts
 * Check department conflicts for date range
 */
router.get('/conflicts', requirePermission('leave.read_own'), leaveController.getDepartmentConflicts);

/**
 * GET /api/leave/calendar/export
 * Export calendar as PDF
 */
router.get('/calendar/export', requirePermission('leave.read_own'), leaveController.exportCalendar);

module.exports = router;

