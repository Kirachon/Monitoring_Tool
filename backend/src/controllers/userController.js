/**
 * User Controller
 * Handles user management HTTP requests
 */

const userService = require('../services/userService');
const logger = require('../config/logger');

class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  async getUsers(req, res) {
    try {
      const { page, perPage, search } = req.query;
      
      const result = await userService.getUsers({
        page: parseInt(page) || 1,
        perPage: parseInt(perPage) || 25,
        search: search || ''
      });
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`Get users error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USERS_FAILED',
          message: 'Failed to fetch users'
        }
      });
    }
  }
  
  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await userService.getUserById(userId);
      
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error(`Get user by ID error: ${error.message}`);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USER_FAILED',
          message: 'Failed to fetch user'
        }
      });
    }
  }
  
  /**
   * Create new user
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const { username, password, employeeId, roles } = req.body;
      
      // Validation
      if (!username || !password || !employeeId || !roles || roles.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username, password, employee ID, and at least one role are required'
          }
        });
      }
      
      // Password complexity validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
          }
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const user = await userService.createUser(
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      logger.error(`Create user error: ${error.message}`);
      
      if (error.message === 'Username already exists') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username already exists'
          }
        });
      }
      
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
          code: 'CREATE_USER_FAILED',
          message: 'Failed to create user'
        }
      });
    }
  }
  
  /**
   * Update user
   * PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const user = await userService.updateUser(
        userId,
        req.body,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      logger.error(`Update user error: ${error.message}`);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_USER_FAILED',
          message: 'Failed to update user'
        }
      });
    }
  }
  
  /**
   * Reset user password
   * POST /api/users/:id/reset-password
   */
  async resetPassword(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      const temporaryPassword = await userService.resetPassword(
        userId,
        req.user.userId,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        data: {
          temporaryPassword
        },
        message: 'Temporary password generated. User must change on first login.'
      });
    } catch (error) {
      logger.error(`Reset password error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: 'Failed to reset password'
        }
      });
    }
  }
}

module.exports = new UserController();

