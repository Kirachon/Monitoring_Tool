/**
 * Dashboard Controller
 * Handles dashboard HTTP requests
 */

const dashboardService = require('../services/dashboardService');
const logger = require('../config/logger');

class DashboardController {
  /**
   * Get dashboard data based on user role
   * GET /api/dashboard
   */
  async getDashboard(req, res) {
    try {
      const roles = req.user.roles || [];
      const role = roles[0];
      let dashboardData;

      switch (role) {
        case 'Employee':
          dashboardData = await dashboardService.getEmployeeDashboard(req.user.id);
          break;
        case 'Supervisor':
          dashboardData = await dashboardService.getSupervisorDashboard(req.user.id);
          break;
        case 'HR Administrator':
          dashboardData = await dashboardService.getHRAdminDashboard();
          break;
        case 'System Administrator':
          dashboardData = await dashboardService.getSystemAdminDashboard();
          break;
        default:
          return res.status(403).json({
            success: false,
            error: {
              code: 'INVALID_ROLE',
              message: 'Invalid user role'
            }
          });
      }

      return res.status(200).json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error(`Get dashboard error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_DASHBOARD_FAILED',
          message: 'Failed to fetch dashboard data'
        }
      });
    }
  }
}

module.exports = new DashboardController();

