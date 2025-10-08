/**
 * Dashboard Routes
 * Defines routes for dashboard endpoints
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/dashboard
 * Get role-specific dashboard data
 */
router.get('/', dashboardController.getDashboard);

module.exports = router;

