/**
 * User Routes
 * Defines routes for user management endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication and system.admin permission
router.use(authenticate);
router.use(requirePermission('system.admin'));

/**
 * GET /api/users
 * Get all users with pagination and search
 */
router.get('/', userController.getUsers);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * POST /api/users
 * Create new user
 */
router.post('/', userController.createUser);

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', userController.updateUser);

/**
 * POST /api/users/:id/reset-password
 * Reset user password
 */
router.post('/:id/reset-password', userController.resetPassword);

module.exports = router;

