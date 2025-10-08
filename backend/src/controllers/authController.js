/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

const authService = require('../services/authService');
const passwordService = require('../services/passwordService');
const logger = require('../config/logger');

class AuthController {
  /**
   * Login endpoint
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { username, password, rememberMe } = req.body;
      
      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Username and password are required'
          }
        });
      }
      
      // Get client info
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      
      // Authenticate
      const result = await authService.login(username, password, ipAddress, userAgent);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      
      // Generic error message for security
      return res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message
        }
      });
    }
  }
  
  /**
   * Logout endpoint
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const token = req.token;
      
      await authService.logout(token);
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Failed to logout'
        }
      });
    }
  }
  
  /**
   * Get current user endpoint
   * GET /api/auth/me
   */
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;
      
      const user = await authService.getCurrentUser(userId);
      
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error(`Get current user error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USER_FAILED',
          message: 'Failed to fetch user information'
        }
      });
    }
  }
  
  /**
   * Verify token endpoint
   * GET /api/auth/verify
   */
  async verifyToken(req, res) {
    try {
      // If we reach here, token is valid (middleware already verified it)
      return res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: req.user
        }
      });
    } catch (error) {
      logger.error(`Verify token error: ${error.message}`);

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token is invalid'
        }
      });
    }
  }

  /**
   * Change password endpoint
   * PUT /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Current password, new password, and confirm password are required'
          }
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PASSWORD_MISMATCH',
            message: 'New password and confirm password do not match'
          }
        });
      }

      // Get client info
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      // Change password
      await passwordService.changePassword(userId, currentPassword, newPassword, ipAddress, userAgent);

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);

      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Current password is incorrect'
          }
        });
      }

      if (error.message.includes('last 3 passwords')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PASSWORD_REUSE',
            message: error.message
          }
        });
      }

      if (error.message.includes('Password must')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: error.message
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'CHANGE_PASSWORD_FAILED',
          message: 'Failed to change password'
        }
      });
    }
  }

  /**
   * Get password status endpoint
   * GET /api/auth/password-status
   */
  async getPasswordStatus(req, res) {
    try {
      const userId = req.user.userId;

      const status = await passwordService.getPasswordStatus(userId);

      return res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error(`Get password status error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATUS_FAILED',
          message: 'Failed to fetch password status'
        }
      });
    }
  }
}

module.exports = new AuthController();

