/**
 * Authentication Routes
 * Defines routes for authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/logout
 * Logout and invalidate session
 * Requires authentication
 */
router.post('/logout', authenticate, authController.logout);

/**
 * GET /api/auth/me
 * Get current user information
 * Requires authentication
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 * Requires authentication
 */
router.get('/verify', authenticate, authController.verifyToken);

/**
 * DEV ONLY: Repair test user roles if missing
 * POST /api/auth/repair-test-roles
 */
router.post('/repair-test-roles', authenticate, async (req, res) => {
  try {
    // Allow only admin user to trigger
    if (req.user?.username !== 'admin') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin only' } });
    }
    const db = require('../config/database');

    const roleIdsByName = {};
    const roles = await db('roles').select('id', 'name');
    roles.forEach(r => roleIdsByName[r.name] = r.id);

    const mapping = [
      { username: 'admin', role: 'System Administrator' },
      { username: 'hradmin', role: 'HR Administrator' },
      { username: 'supervisor', role: 'Supervisor' },
      { username: 'employee', role: 'Employee' },
    ];

    let assigned = 0;
    for (const { username, role } of mapping) {
      const user = await db('users').where({ username }).first();
      if (!user) continue;
      const roleId = roleIdsByName[role];
      if (!roleId) continue;
      const existing = await db('user_roles').where({ user_id: user.id, role_id: roleId }).first();
      if (!existing) {
        await db('user_roles').insert({ user_id: user.id, role_id: roleId });
        assigned++;
      }
    }

    return res.status(200).json({ success: true, data: { assigned } });
  } catch (e) {
    return res.status(500).json({ success: false, error: { code: 'REPAIR_FAILED', message: e.message } });
  }
});


/**
 * PUT /api/auth/change-password
 * Change user password
 * Requires authentication
 */
router.put('/change-password', authenticate, authController.changePassword);

/**
 * GET /api/auth/password-status
 * Get password expiration status
 * Requires authentication
 */
router.get('/password-status', authenticate, authController.getPasswordStatus);

module.exports = router;

