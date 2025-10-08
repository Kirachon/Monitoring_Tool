/**
 * Authentication Service
 * Handles user authentication, login, logout, and session management
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../config/logger');

class AuthService {
  /**
   * Authenticate user and create session
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @param {string} ipAddress - Client IP address
   * @param {string} userAgent - Client user agent
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(username, password, ipAddress, userAgent) {
    try {
      // Find user
      const user = await db('users')
        .where({ username, status: 'active' })
        .first();
      
      if (!user) {
        await this.logFailedAttempt(username, ipAddress);
        throw new Error('Invalid username or password');
      }
      
      // Check if account is locked
      if (user.failed_login_attempts >= 5) {
        const lockoutTime = new Date(user.last_failed_login);
        lockoutTime.setMinutes(lockoutTime.getMinutes() + 15);
        
        if (new Date() < lockoutTime) {
          throw new Error('Account locked. Contact system administrator.');
        } else {
          // Reset failed attempts after lockout period
          await db('users').where({ id: user.id }).update({
            failed_login_attempts: 0,
            last_failed_login: null
          });
        }
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        await this.incrementFailedAttempts(user.id);
        throw new Error('Invalid username or password');
      }

      // Check if password has expired
      const passwordExpired = user.password_expires_at && new Date(user.password_expires_at) < new Date();

      // Reset failed attempts on successful login
      await db('users').where({ id: user.id }).update({
        failed_login_attempts: 0,
        last_failed_login: null,
        last_login: db.fn.now()
      });
      
      // Get employee details
      const employee = await db('employees')
        .where({ id: user.employee_id })
        .first();
      
      // Get user roles and permissions
      const roles = await this.getUserRoles(user.id);
      const permissions = await this.getUserPermissions(user.id);

      // Derive role/permission names
      let roleNames = roles.map(r => r.name);
      let permNames = permissions.map(p => p.name);

      // Development-only fallback: if DB mappings are missing, infer from username
      if (process.env.NODE_ENV === 'development' && roleNames.length === 0) {
        const usernameRoleMap = {
          admin: 'System Administrator',
          hradmin: 'HR Administrator',
          supervisor: 'Supervisor',
          employee: 'Employee'
        };
        const fallbackRole = usernameRoleMap[user.username];
        if (fallbackRole) {
          roleNames = [fallbackRole];
          const permsByRole = {
            'Employee': [
              'pass_slip.create', 'pass_slip.read_own',
              'leave.create', 'leave.read_own',
              'employee.read_own', 'certificate.request',
              'department.read'
            ],
            'Supervisor': [
              'pass_slip.create', 'pass_slip.read_own', 'pass_slip.read_all', 'pass_slip.approve',
              'leave.create', 'leave.read_own', 'leave.read_all', 'leave.approve',
              'employee.read_own', 'employee.read_all',
              'certificate.request', 'department.read',
              'reports.view'
            ],
            'HR Administrator': [
              'pass_slip.create', 'pass_slip.read_own', 'pass_slip.read_all', 'pass_slip.approve', 'pass_slip.cancel',
              'leave.create', 'leave.read_own', 'leave.read_all', 'leave.approve', 'leave.cancel', 'leave.configure',
              'employee.read_own', 'employee.read_all', 'employee.write',
              'certificate.request', 'certificate.generate', 'certificate.manage_templates',
              'department.read', 'department.write',
              'reports.view', 'reports.export'
            ],
            'System Administrator': [
              'pass_slip.create', 'pass_slip.read_own', 'pass_slip.read_all', 'pass_slip.approve', 'pass_slip.cancel',
              'leave.create', 'leave.read_own', 'leave.read_all', 'leave.approve', 'leave.cancel', 'leave.configure',
              'employee.read_own', 'employee.read_all', 'employee.write', 'employee.delete',
              'certificate.request', 'certificate.generate', 'certificate.manage_templates',
              'department.read', 'department.write',
              'reports.view', 'reports.export',
              'user.read', 'user.write', 'user.delete', 'user.assign_roles',
              'system.config', 'system.audit_log', 'system.admin'
            ]
          };
          permNames = permsByRole[fallbackRole] || [];
        }
      }

      // Generate JWT token
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        employeeId: employee?.employee_id || null,
        roles: roleNames,
        permissions: permNames
      };
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '8h' }
      );
      
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8);
      
      // Create session (skip in development)
      if (process.env.NODE_ENV !== 'development') {
        await db('sessions').insert({
          user_id: user.id,
          token,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt
        });
      }
      
      logger.info(`User ${username} logged in successfully from IP ${ipAddress}`);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          employeeId: employee?.employee_id || null,
          fullName: employee ? `${employee.first_name} ${employee.last_name}` : null,
          roles: roleNames,
          permissions: permNames,
          mustChangePassword: user.must_change_password || passwordExpired
        }
      };
    } catch (error) {
      logger.error(`Login error for username ${username}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Logout user and invalidate session
   * @param {string} token - JWT token
   */
  async logout(token) {
    try {
      await db('sessions').where({ token }).delete();
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get current user information
   * @param {number} userId - User ID
   * @returns {Promise<object>}
   */
  async getCurrentUser(userId) {
    try {
      const user = await db('users')
        .where({ 'users.id': userId })
        .leftJoin('employees', 'users.employee_id', 'employees.id')
        .select(
          'users.id',
          'users.username',
          'users.last_login',
          'employees.employee_id',
          'employees.first_name',
          'employees.middle_name',
          'employees.last_name',
          'employees.position',
          'employees.department_id'
        )
        .first();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const roles = await this.getUserRoles(userId);
      const permissions = await this.getUserPermissions(userId);
      
      return {
        id: user.id,
        username: user.username,
        employeeId: user.employee_id,
        fullName: user.first_name && user.last_name 
          ? `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`
          : null,
        position: user.position,
        departmentId: user.department_id,
        roles: roles.map(r => r.name),
        permissions: permissions.map(p => p.name),
        lastLogin: user.last_login
      };
    } catch (error) {
      logger.error(`Get current user error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get user roles
   * @param {number} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUserRoles(userId) {
    return db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where('user_roles.user_id', userId)
      .select('roles.id', 'roles.name');
  }
  
  /**
   * Get user permissions (distinct from all assigned roles)
   * @param {number} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUserPermissions(userId) {
    return db('user_roles')
      .join('role_permissions', 'user_roles.role_id', 'role_permissions.role_id')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .where('user_roles.user_id', userId)
      .distinct('permissions.id', 'permissions.name');
  }
  
  /**
   * Increment failed login attempts
   * @param {number} userId - User ID
   */
  async incrementFailedAttempts(userId) {
    await db('users')
      .where({ id: userId })
      .increment('failed_login_attempts', 1)
      .update({ last_failed_login: db.fn.now() });
  }
  
  /**
   * Log failed login attempt
   * @param {string} username - Username
   * @param {string} ipAddress - IP address
   */
  async logFailedAttempt(username, ipAddress) {
    logger.warn(`Failed login attempt for username: ${username} from IP: ${ipAddress}`);
  }
  
  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  
  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<object>}
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if session exists and is not expired
      const session = await db('sessions')
        .where({ token })
        .where('expires_at', '>', db.fn.now())
        .first();
      
      if (!session) {
        throw new Error('Session expired or invalid');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();

