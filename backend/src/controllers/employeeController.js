/**
 * Employee Controller
 * Handles employee management HTTP requests
 */

const employeeService = require('../services/employeeService');
const logger = require('../config/logger');

class EmployeeController {
  /**
   * Get all employees
   * GET /api/employees
   */
  async getEmployees(req, res) {
    try {
      const { page, perPage, search, department, employmentStatus, salaryGrade, salaryGradeMin, salaryGradeMax, dateHiredFrom, dateHiredTo } = req.query;

      const result = await employeeService.getEmployees({
        page: parseInt(page) || 1,
        perPage: parseInt(perPage) || 25,
        search: search || '',
        department: department || '',
        employmentStatus: employmentStatus || '',
        salaryGrade: salaryGrade || '',
        salaryGradeMin: salaryGradeMin || '',
        salaryGradeMax: salaryGradeMax || '',
        dateHiredFrom: dateHiredFrom || '',
        dateHiredTo: dateHiredTo || '',
        userId: req.user.employeeId,
        userRole: req.user.roles?.[0]
      });
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`Get employees error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_EMPLOYEES_FAILED',
          message: 'Failed to fetch employees'
        }
      });
    }
  }
  
  /**
   * Get employee by ID
   * GET /api/employees/:id
   */
  async getEmployeeById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const employee = await employeeService.getEmployeeById(id);
      
      return res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error(`Get employee by ID error: ${error.message}`);
      
      if (error.message === 'Employee not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'EMPLOYEE_NOT_FOUND',
            message: 'Employee not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_EMPLOYEE_FAILED',
          message: 'Failed to fetch employee'
        }
      });
    }
  }
  
  /**
   * Create new employee
   * POST /api/employees
   */
  async createEmployee(req, res) {
    try {
      const { firstName, lastName, dateOfBirth, gender, civilStatus, position, salaryGrade, departmentId, employmentStatus, dateHired } = req.body;
      
      // Validation
      if (!firstName || !lastName || !dateOfBirth || !gender || !civilStatus || !position || !salaryGrade || !departmentId || !employmentStatus || !dateHired) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Required fields: firstName, lastName, dateOfBirth, gender, civilStatus, position, salaryGrade, departmentId, employmentStatus, dateHired'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const employee = await employeeService.createEmployee(
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      logger.error(`Create employee error: ${error.message}`);
      
      if (error.message === 'Employee ID already exists') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMPLOYEE_ID',
            message: error.message
          }
        });
      }
      
      if (error.message.includes('future')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DATE',
            message: error.message
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_EMPLOYEE_FAILED',
          message: 'Failed to create employee'
        }
      });
    }
  }
  
  /**
   * Bulk import employees
   * POST /api/employees/import
   */
  async bulkImport(req, res) {
    try {
      const { employees } = req.body;

      if (!employees || !Array.isArray(employees) || employees.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Employees array is required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const results = await employeeService.bulkImportEmployees(
        employees,
        req.user.userId,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        data: results,
        message: `Import completed: ${results.successful} successful, ${results.failed} failed`
      });
    } catch (error) {
      logger.error(`Bulk import error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'IMPORT_FAILED',
          message: 'Failed to import employees'
        }
      });
    }
  }

  /**
   * Update employee
   * PUT /api/employees/:id
   */
  async updateEmployee(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const employee = await employeeService.updateEmployee(
        id,
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: employee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      logger.error(`Update employee error: ${error.message}`);
      
      if (error.message === 'Employee not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'EMPLOYEE_NOT_FOUND',
            message: 'Employee not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_EMPLOYEE_FAILED',
          message: 'Failed to update employee'
        }
      });
    }
  }
}

module.exports = new EmployeeController();

