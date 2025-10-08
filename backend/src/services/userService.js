/**
 * User Service
 * Handles user management operations
 */

const bcrypt = require('bcrypt');
const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class UserService {
  /**
   * Get all users with pagination and search
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  async getUsers({ page = 1, perPage = 25, search = '' }) {
    try {
      const offset = (page - 1) * perPage;
      
      let query = db('users')
        .leftJoin('employees', 'users.employee_id', 'employees.id')
        .select(
          'users.id',
          'users.username',
          'users.status',
          'users.last_login',
          'employees.employee_id as employeeId',
          'employees.first_name',
          'employees.middle_name',
          'employees.last_name'
        );
      
      // Apply search filter
      if (search) {
        query = query.where(function() {
          this.where('users.username', 'ilike', `%${search}%`)
            .orWhere('employees.employee_id', 'ilike', `%${search}%`)
            .orWhere('employees.first_name', 'ilike', `%${search}%`)
            .orWhere('employees.last_name', 'ilike', `%${search}%`);
        });
      }
      
      // Get total count (separate builder to avoid select/aggregation conflict)
      const countBuilder = db('users')
        .leftJoin('employees', 'users.employee_id', 'employees.id');
      if (search) {
        countBuilder.where(function() {
          this.where('users.username', 'ilike', `%${search}%`)
            .orWhere('employees.employee_id', 'ilike', `%${search}%`)
            .orWhere('employees.first_name', 'ilike', `%${search}%`)
            .orWhere('employees.last_name', 'ilike', `%${search}%`);
        });
      }
      const { count } = await countBuilder.countDistinct('users.id as count').first();
      const total = parseInt(count);
      
      // Get paginated results
      const users = await query
        .orderBy('users.id', 'asc')
        .limit(perPage)
        .offset(offset);
      
      // Get roles for each user
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const roles = await this.getUserRoles(user.id);
          
          return {
            id: user.id,
            username: user.username,
            fullName: user.first_name && user.last_name
              ? `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`
              : null,
            employeeId: user.employeeId,
            roles: roles.map(r => r.name),
            status: user.status,
            lastLogin: user.last_login
          };
        })
      );
      
      return {
        users: usersWithRoles,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage)
        }
      };
    } catch (error) {
      logger.error(`Get users error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>}
   */
  async getUserById(userId) {
    try {
      const user = await db('users')
        .leftJoin('employees', 'users.employee_id', 'employees.id')
        .where('users.id', userId)
        .select(
          'users.id',
          'users.username',
          'users.status',
          'users.last_login',
          'users.employee_id',
          'employees.employee_id as employeeIdString',
          'employees.first_name',
          'employees.middle_name',
          'employees.last_name'
        )
        .first();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const roles = await this.getUserRoles(userId);
      
      return {
        id: user.id,
        username: user.username,
        fullName: user.first_name && user.last_name
          ? `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`
          : null,
        employeeId: user.employeeIdString,
        employee_id: user.employee_id,
        roles: roles.map(r => ({ id: r.id, name: r.name })),
        status: user.status,
        lastLogin: user.last_login
      };
    } catch (error) {
      logger.error(`Get user by ID error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Create new user
   * @param {Object} userData - User data
   * @param {number} createdBy - ID of user creating this user
   * @returns {Promise<Object>}
   */
  async createUser(userData, createdBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      // Check if username already exists
      const existingUser = await trx('users')
        .where({ username: userData.username })
        .first();
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      // Check if employee exists
      const employee = await trx('employees')
        .where({ id: userData.employeeId })
        .first();
      
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Hash password
      const password_hash = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const [user] = await trx('users').insert({
        username: userData.username,
        password_hash,
        employee_id: userData.employeeId,
        status: 'active',
        must_change_password: true,
        created_by: createdBy,
        updated_by: createdBy
      }).returning('*');
      
      // Assign roles
      if (userData.roles && userData.roles.length > 0) {
        const roleAssignments = userData.roles.map(roleId => ({
          user_id: user.id,
          role_id: roleId,
          assigned_by: createdBy
        }));
        
        await trx('user_roles').insert(roleAssignments);
      }
      
      await trx.commit();
      
      // Log audit
      await auditLogService.logCreate(
        createdBy,
        'User Management',
        'user',
        user.id,
        { username: user.username, roles: userData.roles },
        ipAddress,
        userAgent
      );
      
      logger.info(`User ${user.username} created by user ${createdBy}`);
      
      return await this.getUserById(user.id);
    } catch (error) {
      await trx.rollback();
      logger.error(`Create user error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update user
   * @param {number} userId - User ID
   * @param {Object} userData - User data
   * @param {number} updatedBy - ID of user updating this user
   * @returns {Promise<Object>}
   */
  async updateUser(userId, userData, updatedBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const user = await trx('users').where({ id: userId }).first();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Update user
      await trx('users')
        .where({ id: userId })
        .update({
          status: userData.status || user.status,
          updated_by: updatedBy,
          updated_at: trx.fn.now()
        });
      
      // Update roles if provided
      if (userData.roles) {
        // Remove existing roles
        await trx('user_roles').where({ user_id: userId }).delete();
        
        // Add new roles
        if (userData.roles.length > 0) {
          const roleAssignments = userData.roles.map(roleId => ({
            user_id: userId,
            role_id: roleId,
            assigned_by: updatedBy
          }));
          
          await trx('user_roles').insert(roleAssignments);
        }
      }
      
      await trx.commit();
      
      // Log audit
      await auditLogService.logUpdate(
        updatedBy,
        'User Management',
        'user',
        userId,
        { status: userData.status, roles: userData.roles },
        ipAddress,
        userAgent
      );
      
      logger.info(`User ${userId} updated by user ${updatedBy}`);
      
      return await this.getUserById(userId);
    } catch (error) {
      await trx.rollback();
      logger.error(`Update user error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Reset user password
   * @param {number} userId - User ID
   * @param {number} resetBy - ID of user resetting password
   * @returns {Promise<string>} - Temporary password
   */
  async resetPassword(userId, resetBy, ipAddress, userAgent) {
    try {
      // Generate temporary password
      const tempPassword = this.generateTemporaryPassword();
      const password_hash = await bcrypt.hash(tempPassword, 10);
      
      // Update user
      await db('users')
        .where({ id: userId })
        .update({
          password_hash,
          must_change_password: true,
          updated_by: resetBy,
          updated_at: db.fn.now()
        });
      
      // Log audit
      await auditLogService.log({
        user_id: resetBy,
        action: 'RESET_PASSWORD',
        module: 'User Management',
        entity_type: 'user',
        entity_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Password reset for user ${userId} by user ${resetBy}`);
      
      return tempPassword;
    } catch (error) {
      logger.error(`Reset password error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate temporary password
   * @returns {string}
   */
  generateTemporaryPassword() {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const special = '!@#$%';
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Shuffle
    return password.split('').sort(() => Math.random() - 0.5).join('');
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
}

module.exports = new UserService();

