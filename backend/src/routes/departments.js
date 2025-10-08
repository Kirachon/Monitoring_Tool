/**
 * Department Routes
 * Defines routes for department management endpoints
 */

const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/departments
 * Get all departments with hierarchy
 */
router.get('/', requirePermission('department.read'), departmentController.getDepartments);

/**
 * GET /api/departments/:id
 * Get department by ID
 */
router.get('/:id', requirePermission('department.read'), departmentController.getDepartmentById);

/**
 * POST /api/departments
 * Create new department
 * Requires department.write permission
 */
router.post('/', requirePermission('department.write'), departmentController.createDepartment);

/**
 * PUT /api/departments/:id
 * Update department
 * Requires department.write permission
 */
router.put('/:id', requirePermission('department.write'), departmentController.updateDepartment);

/**
 * DELETE /api/departments/:id
 * Delete department
 * Requires department.write permission
 */
router.delete('/:id', requirePermission('department.write'), departmentController.deleteDepartment);

module.exports = router;

