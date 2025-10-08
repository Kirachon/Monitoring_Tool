/**
 * Department Controller
 * Handles department management HTTP requests
 */

const departmentService = require('../services/departmentService');
const logger = require('../config/logger');

class DepartmentController {
  /**
   * Get all departments
   * GET /api/departments
   */
  async getDepartments(req, res) {
    try {
      const departments = await departmentService.getDepartments();
      
      return res.status(200).json({
        success: true,
        data: departments
      });
    } catch (error) {
      logger.error(`Get departments error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_DEPARTMENTS_FAILED',
          message: 'Failed to fetch departments'
        }
      });
    }
  }
  
  /**
   * Get department by ID
   * GET /api/departments/:id
   */
  async getDepartmentById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const department = await departmentService.getDepartmentById(id);
      
      return res.status(200).json({
        success: true,
        data: department
      });
    } catch (error) {
      logger.error(`Get department by ID error: ${error.message}`);
      
      if (error.message === 'Department not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DEPARTMENT_NOT_FOUND',
            message: 'Department not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_DEPARTMENT_FAILED',
          message: 'Failed to fetch department'
        }
      });
    }
  }
  
  /**
   * Create new department
   * POST /api/departments
   */
  async createDepartment(req, res) {
    try {
      const { name, parentId, deptHeadId } = req.body;
      
      // Validation
      if (!name) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Department name is required'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const department = await departmentService.createDepartment(
        { name, parentId, deptHeadId },
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: department,
        message: 'Department created successfully'
      });
    } catch (error) {
      logger.error(`Create department error: ${error.message}`);
      
      if (error.message.includes('unique')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_DEPARTMENT',
            message: error.message
          }
        });
      }
      
      if (error.message === 'Department head not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DEPT_HEAD_NOT_FOUND',
            message: 'Department head not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_DEPARTMENT_FAILED',
          message: 'Failed to create department'
        }
      });
    }
  }
  
  /**
   * Update department
   * PUT /api/departments/:id
   */
  async updateDepartment(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const department = await departmentService.updateDepartment(
        id,
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: department,
        message: 'Department updated successfully'
      });
    } catch (error) {
      logger.error(`Update department error: ${error.message}`);
      
      if (error.message === 'Department not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DEPARTMENT_NOT_FOUND',
            message: 'Department not found'
          }
        });
      }
      
      if (error.message.includes('unique')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_DEPARTMENT',
            message: error.message
          }
        });
      }
      
      if (error.message.includes('circular')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CIRCULAR_REFERENCE',
            message: error.message
          }
        });
      }
      
      if (error.message === 'Department head not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DEPT_HEAD_NOT_FOUND',
            message: 'Department head not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_DEPARTMENT_FAILED',
          message: 'Failed to update department'
        }
      });
    }
  }
  
  /**
   * Delete department
   * DELETE /api/departments/:id
   */
  async deleteDepartment(req, res) {
    try {
      const id = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      await departmentService.deleteDepartment(
        id,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      logger.error(`Delete department error: ${error.message}`);
      
      if (error.message === 'Department not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DEPARTMENT_NOT_FOUND',
            message: 'Department not found'
          }
        });
      }
      
      if (error.message.includes('assigned employees')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DEPARTMENT_HAS_EMPLOYEES',
            message: error.message
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_DEPARTMENT_FAILED',
          message: 'Failed to delete department'
        }
      });
    }
  }
}

module.exports = new DepartmentController();

