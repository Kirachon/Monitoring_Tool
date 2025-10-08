/**
 * Pass Slip Routes
 * Defines routes for pass slip management endpoints
 */

const express = require('express');
const router = express.Router();
const passSlipController = require('../controllers/passSlipController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/pass-slips
 * Create new pass slip
 */
router.post('/', requirePermission('pass_slip.create'), passSlipController.createPassSlip);

/**
 * GET /api/pass-slips/all
 * Get all pass slips (HR admin)
 */
router.get('/all', requirePermission('pass_slip.read_all'), passSlipController.getAllPassSlips);

/**
 * GET /api/pass-slips/department
 * Get department pass slips (Supervisor)
 */
router.get('/department', requirePermission('pass_slip.approve'), passSlipController.getDepartmentPassSlips);

/**
 * GET /api/pass-slips/approvals/pending
 * Get pending approvals for current user
 */
router.get('/approvals/pending', requirePermission('pass_slip.approve'), passSlipController.getPendingApprovals);

/**
 * GET /api/pass-slips
 * Get pass slips for current user
 */
router.get('/', requirePermission('pass_slip.read_own'), passSlipController.getPassSlips);

/**
 * GET /api/pass-slips/overdue
 * Get overdue pass slips for supervisor
 */
router.get('/overdue', requirePermission('pass_slip.approve'), passSlipController.getOverduePassSlips);

/**
 * PUT /api/pass-slips/:id/approve
 * Approve pass slip
 */
router.put('/:id/approve', requirePermission('pass_slip.approve'), passSlipController.approvePassSlip);

/**
 * PUT /api/pass-slips/:id/deny
 * Deny pass slip
 */
router.put('/:id/deny', requirePermission('pass_slip.approve'), passSlipController.denyPassSlip);

/**
 * PUT /api/pass-slips/:id/return
 * Record return time
 */
router.put('/:id/return', requirePermission('pass_slip.read_own'), passSlipController.recordReturn);

/**
 * GET /api/pass-slips/:id
 * Get pass slip by ID
 */
router.get('/:id', requirePermission('pass_slip.read_own'), passSlipController.getPassSlipById);

module.exports = router;

