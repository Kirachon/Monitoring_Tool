/**
 * Password Service
 * Handles password management operations
 */

const bcrypt = require('bcrypt');
const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class PasswordService {
  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, currentPassword, newPassword, ipAddress, userAgent) {
    try {
      // Get user
      const user = await db('users').where({ id: userId }).first();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        // Increment failed attempts
        await db('users')
          .where({ id: userId })
          .increment('failed_login_attempts', 1)
          .update({ last_failed_login: db.fn.now() });
        
        // Log failed attempt
        await auditLogService.log({
          user_id: userId,
          action: 'CHANGE_PASSWORD_FAILED',
          module: 'Password Management',
          details: { reason: 'Incorrect current password' },
          ip_address: ipAddress,
          user_agent: userAgent
        });
        
        throw new Error('Current password is incorrect');
      }
      
      // Check password complexity
      this.validatePasswordComplexity(newPassword);
      
      // Check password history (last 3 passwords)
      await this.checkPasswordHistory(userId, newPassword);
      
      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      // Get password expiry days from config (default 90)
      const config = await db('system_config')
        .where({ config_key: 'password_expiry_days' })
        .first();
      const expiryDays = config ? parseInt(config.config_value) : 90;
      
      // Update user password
      await db('users').where({ id: userId }).update({
        password_hash: newPasswordHash,
        password_changed_at: db.fn.now(),
        password_expires_at: db.raw(`CURRENT_TIMESTAMP + INTERVAL '${expiryDays} days'`),
        must_change_password: false,
        failed_login_attempts: 0,
        last_failed_login: null,
        updated_at: db.fn.now()
      });
      
      // Add to password history
      await db('password_history').insert({
        user_id: userId,
        password_hash: newPasswordHash,
        created_at: db.fn.now()
      });
      
      // Keep only last 3 passwords in history
      const historyToDelete = await db('password_history')
        .where({ user_id: userId })
        .orderBy('created_at', 'desc')
        .offset(3)
        .select('id');
      
      if (historyToDelete.length > 0) {
        await db('password_history')
          .whereIn('id', historyToDelete.map(h => h.id))
          .delete();
      }
      
      // Log password change
      await auditLogService.log({
        user_id: userId,
        action: 'CHANGE_PASSWORD',
        module: 'Password Management',
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      logger.info(`Password changed for user ${user.username}`);
      
      // Invalidate all sessions for this user (force re-login)
      await db('sessions').where({ user_id: userId }).delete();
      
      return true;
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Validate password complexity
   * @param {string} password - Password to validate
   * @throws {Error} If password doesn't meet requirements
   */
  validatePasswordComplexity(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  }
  
  /**
   * Check if password matches any of last 3 passwords
   * @param {number} userId - User ID
   * @param {string} newPassword - New password to check
   * @throws {Error} If password matches history
   */
  async checkPasswordHistory(userId, newPassword) {
    const history = await db('password_history')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(3)
      .select('password_hash');
    
    for (const record of history) {
      const matches = await bcrypt.compare(newPassword, record.password_hash);
      if (matches) {
        throw new Error('New password cannot match any of your last 3 passwords');
      }
    }
  }
  
  /**
   * Get password status for user
   * @param {number} userId - User ID
   * @returns {Promise<Object>}
   */
  async getPasswordStatus(userId) {
    const user = await db('users')
      .where({ id: userId })
      .select('password_changed_at', 'password_expires_at', 'must_change_password')
      .first();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const now = new Date();
    const expiresAt = user.password_expires_at ? new Date(user.password_expires_at) : null;
    
    let daysUntilExpiration = 0;
    if (expiresAt) {
      daysUntilExpiration = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    }
    
    return {
      passwordChangedAt: user.password_changed_at,
      passwordExpiresAt: user.password_expires_at,
      daysUntilExpiration: Math.max(0, daysUntilExpiration),
      mustChangePassword: user.must_change_password || daysUntilExpiration <= 0
    };
  }
  
  /**
   * Calculate password strength
   * @param {string} password - Password to check
   * @returns {number} Strength score (0-100)
   */
  calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    
    // Character types
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
    
    return Math.min(100, strength);
  }
}

module.exports = new PasswordService();

