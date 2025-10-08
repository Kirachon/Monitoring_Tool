/**
 * Holiday Routes
 * Defines routes for holiday management endpoints
 */

const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/holidays
 * Get holidays for a year
 */
router.get('/', holidayController.getHolidays);

/**
 * POST /api/holidays
 * Create new holiday
 * Requires system.admin permission
 */
router.post('/', requirePermission('system.admin'), holidayController.createHoliday);

/**
 * PUT /api/holidays/:id
 * Update holiday
 * Requires system.admin permission
 */
router.put('/:id', requirePermission('system.admin'), holidayController.updateHoliday);

/**
 * DELETE /api/holidays/:id
 * Delete holiday
 * Requires system.admin permission
 */
router.delete('/:id', requirePermission('system.admin'), holidayController.deleteHoliday);

module.exports = router;

