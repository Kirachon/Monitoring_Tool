/**
 * Employee Routes
 * Defines routes for employee management endpoints
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/employees
 * Get all employees with pagination, search, and filters
 */
router.get('/', requirePermission('employee.read_all'), employeeController.getEmployees);

/**
 * GET /api/employees/:id
 * Get employee by ID
 */
router.get('/:id', requirePermission('employee.read_all'), employeeController.getEmployeeById);

/**
 * POST /api/employees/import
 * Bulk import employees
 * Requires employee.write permission
 */
router.post('/import', requirePermission('employee.write'), employeeController.bulkImport);

/**
 * POST /api/employees
 * Create new employee
 * Requires employee.write permission
 */
router.post('/', requirePermission('employee.write'), employeeController.createEmployee);

/**
 * PUT /api/employees/:id
 * Update employee
 * Requires employee.write permission
 */
router.put('/:id', requirePermission('employee.write'), employeeController.updateEmployee);

module.exports = router;

