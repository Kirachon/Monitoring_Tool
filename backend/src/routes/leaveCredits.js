/**
 * Leave Credit Routes
 * Defines routes for leave credit management endpoints
 */

const express = require('express');
const router = express.Router();
const leaveCreditController = require('../controllers/leaveCreditController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/leave-credits/balances/:employeeId
 * Get leave balances for employee
 */
router.get('/balances/:employeeId', requirePermission('leave.read'), leaveCreditController.getLeaveBalances);

/**
 * GET /api/leave-credits/history/:employeeId
 * Get leave credit history for employee
 */
router.get('/history/:employeeId', requirePermission('leave.read'), leaveCreditController.getLeaveCredits);

/**
 * POST /api/leave-credits/adjust
 * Adjust leave credits manually
 */
router.post('/adjust', requirePermission('leave.manage'), leaveCreditController.adjustLeaveCredits);

/**
 * POST /api/leave-credits/process-accrual
 * Process monthly accrual (admin only)
 */
router.post('/process-accrual', requirePermission('system.configure'), leaveCreditController.processMonthlyAccrual);

module.exports = router;

