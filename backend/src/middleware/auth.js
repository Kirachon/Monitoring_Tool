/**
 * Authentication Middleware
 * Validates JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('../services/auditLogService');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication required'
        }
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session exists and is not expired (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      const session = await db('sessions')
        .where({ token })
        .where('expires_at', '>', db.fn.now())
        .first();

      if (!session) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_SESSION',
            message: 'Session expired or invalid'
          }
        });
      }
    }

    // Attach user info to request
    req.user = decoded;
    req.token = token;

    // Fallback: hydrate roles/permissions from DB if missing in token
    try {
      if (!req.user.roles || req.user.roles.length === 0) {
        const roles = await db('user_roles')
          .join('roles', 'user_roles.role_id', 'roles.id')
          .where('user_roles.user_id', req.user.userId)
          .select('roles.name');
        req.user.roles = roles.map(r => r.name);
      }
      if (!req.user.permissions || req.user.permissions.length === 0) {
        const permissions = await db('user_roles')
          .join('role_permissions', 'user_roles.role_id', 'role_permissions.role_id')
          .join('permissions', 'role_permissions.permission_id', 'permissions.id')
          .where('user_roles.user_id', req.user.userId)
          .distinct('permissions.name');
        req.user.permissions = permissions.map(p => p.name);
      }
    } catch (e) {
      logger.error(`Failed to hydrate roles/permissions: ${e.message}`);
    }

    // Normalize identifiers and hydrate numeric employee ID if token carries employee code
    if (!req.user.id && req.user.userId) {
      req.user.id = req.user.userId;
    }
    try {
      if (req.user.employeeId && typeof req.user.employeeId === 'string') {
        const emp = await db('employees').where({ employee_id: req.user.employeeId }).first();
        if (emp) {
          req.user.employeeCode = req.user.employeeId;
          req.user.employeeId = emp.id; // prefer numeric employee PK for downstream services
        }
      }
    } catch (e) {
      logger.warn(`Failed to hydrate employee numeric ID: ${e.message}`);
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token expired'
        }
      });
    }

    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string|Array<string>} roles - Required role(s)
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required'
        }
      });
    }

    const userRoles = req.user.roles || [];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      // Log access denial
      auditLogService.logAccessDenied(
        req.user.userId,
        `role:${requiredRoles.join(',')}`,
        req.ip,
        req.headers['user-agent']
      );

      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to access this resource'
        }
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has required permission
 * @param {string|Array<string>} permissions - Required permission(s)
 */
const requirePermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required'
        }
      });
    }

    const userPermissions = req.user.permissions || [];
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      // Log access denial
      auditLogService.logAccessDenied(
        req.user.userId,
        requiredPermissions.join(','),
        req.ip,
        req.headers['user-agent']
      );

      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to perform this action'
        }
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  requirePermission
};

