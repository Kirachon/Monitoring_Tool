/**
 * Dashboard Service
 * Handles dashboard analytics business logic
 */

const db = require('../config/database');
const logger = require('../config/logger');

class DashboardService {
  /**
   * Get employee dashboard data
   * @param {number} userId - User ID
   * @returns {Promise<Object>}
   */
  async getEmployeeDashboard(userId) {
    try {
      const user = await db('users').where({ id: userId }).first();
      const employee = await db('employees').where({ id: user.employee_id }).first();

      // Leave balance for VL and SL
      const vl = await db('leave_balances as lb')
        .join('leave_types as lt', 'lb.leave_type_id', 'lt.id')
        .where({ 'lb.employee_id': employee.id, 'lt.code': 'VL' })
        .select('lb.current_balance')
        .first();
      const sl = await db('leave_balances as lb')
        .join('leave_types as lt', 'lb.leave_type_id', 'lt.id')
        .where({ 'lb.employee_id': employee.id, 'lt.code': 'SL' })
        .select('lb.current_balance')
        .first();

      // Pending requests count
      const pendingCount = await db('leave_requests')
        .where({ employee_id: employee.id, status: 'Pending' })
        .count('* as count')
        .first();

      // Upcoming leaves (next 30 days)
      const upcomingLeaves = await db('leave_requests as lr')
        .join('leave_types as lt', 'lr.leave_type_id', 'lt.id')
        .where({ 'lr.employee_id': employee.id, 'lr.status': 'Approved' })
        .where('lr.date_from', '>=', db.fn.now())
        .where('lr.date_from', '<=', db.raw("CURRENT_DATE + INTERVAL '30 days'"))
        .orderBy('lr.date_from', 'asc')
        .limit(5)
        .select('lr.id', 'lt.name as leave_type_name', 'lr.date_from', 'lr.date_to', 'lr.num_days');

      // Recent pass slips
      const recentPassSlips = await db('pass_slips')
        .where({ employee_id: employee.id })
        .orderBy('created_at', 'desc')
        .limit(5);

      return {
        leaveBalance: {
          vacationLeave: parseFloat(vl?.current_balance || 0),
          sickLeave: parseFloat(sl?.current_balance || 0)
        },
        pendingRequests: parseInt(pendingCount.count),
        upcomingLeaves: upcomingLeaves.map(l => ({
          id: l.id,
          leaveType: l.leave_type_name,
          startDate: l.date_from,
          endDate: l.date_to,
          days: parseFloat(l.num_days)
        })),
        recentPassSlips: recentPassSlips.map(ps => ({
          id: ps.id,
          date: ps.date,
          timeOut: ps.time_out,
          timeIn: ps.actual_time_in,
          purpose: ps.reason,
          status: ps.status
        }))
      };
    } catch (error) {
      logger.error(`Get employee dashboard error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get supervisor dashboard data
   * @param {number} userId - User ID
   * @returns {Promise<Object>}
   */
  async getSupervisorDashboard(userId) {
    try {
      const user = await db('users').where({ id: userId }).first();
      const employee = await db('employees').where({ id: user.employee_id }).first();

      // Pending approvals count via approvals table (approver is users.id)
      const pendingPassSlips = await db('approvals as appr')
        .join('pass_slips as ps', 'appr.entity_id', 'ps.id')
        .where({ 'appr.entity_type': 'pass_slip', 'appr.approver_id': userId, 'appr.action': 'Pending' })
        .count('* as count')
        .first();

      const pendingLeaves = await db('approvals as appr')
        .join('leave_requests as lr', 'appr.entity_id', 'lr.id')
        .where({ 'appr.entity_type': 'leave_request', 'appr.approver_id': userId, 'appr.action': 'Pending' })
        .count('* as count')
        .first();

      // Team on leave today (department match and correct columns)
      const teamOnLeave = await db('leave_requests as lr')
        .join('employees as e', 'lr.employee_id', 'e.id')
        .where({ 'lr.status': 'Approved' })
        .where('lr.date_from', '<=', db.fn.now())
        .where('lr.date_to', '>=', db.fn.now())
        .where('e.department_id', employee.department_id)
        .join('leave_types as lt', 'lr.leave_type_id', 'lt.id')
        .select('e.first_name', 'e.last_name', 'lt.name as leave_type');

      // Department leave utilization
      const deptEmployees = await db('employees')
        .where({ department_id: employee.department_id, status: 'active' })
        .count('* as count')
        .first();

      const deptLeaveDays = await db('leave_requests as lr')
        .join('employees as e', 'lr.employee_id', 'e.id')
        .where({ 'e.department_id': employee.department_id, 'lr.status': 'Approved' })
        .whereRaw('EXTRACT(YEAR FROM lr.date_from) = EXTRACT(YEAR FROM CURRENT_DATE)')
        .sum('lr.num_days as total')
        .first();

      const utilizationRate = deptEmployees.count > 0 
        ? ((deptLeaveDays.total || 0) / (deptEmployees.count * 15) * 100).toFixed(1)
        : 0;

      // Recent approvals
      const recentApprovals = await db('audit_logs')
        .where({ user_id: userId })
        .whereIn('action', ['APPROVE_PASS_SLIP', 'DENY_PASS_SLIP', 'APPROVE_LEAVE_REQUEST', 'DENY_LEAVE_REQUEST'])
        .whereIn('entity_type', ['pass_slip', 'leave_request'])
        .orderBy('created_at', 'desc')
        .limit(10);

      return {
        pendingApprovals: {
          passSlips: parseInt(pendingPassSlips.count),
          leaveRequests: parseInt(pendingLeaves.count),
          total: parseInt(pendingPassSlips.count) + parseInt(pendingLeaves.count)
        },
        teamOnLeave: teamOnLeave.map(t => ({
          name: `${t.first_name} ${t.last_name}`,
          leaveType: t.leave_type
        })),
        departmentLeaveUtilization: parseFloat(utilizationRate),
        recentApprovals: recentApprovals.map(a => ({
          id: a.id,
          entityType: a.entity_type,
          entityId: a.entity_id,
          action: a.action,
          timestamp: a.timestamp
        }))
      };
    } catch (error) {
      logger.error(`Get supervisor dashboard error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get HR admin dashboard data
   * @returns {Promise<Object>}
   */
  async getHRAdminDashboard() {
    try {
      // System overview
      const totalEmployees = await db('employees')
        .where({ status: 'Active' })
        .count('* as count')
        .first();

      const activeUsers = await db('users')
        .where({ status: 'active' })
        .count('* as count')
        .first();

      const pendingApprovals = await db('pass_slips')
        .where({ status: 'Pending' })
        .count('* as count')
        .first();

      const pendingLeaves = await db('leave_requests')
        .where({ status: 'Pending' })
        .count('* as count')
        .first();

      // Leave statistics (current month)
      const leaveStats = await db('leave_requests as lr')
        .join('leave_types as lt', 'lr.leave_type_id', 'lt.id')
        .where({ 'lr.status': 'Approved' })
        .whereRaw('EXTRACT(MONTH FROM lr.date_from) = EXTRACT(MONTH FROM CURRENT_DATE)')
        .whereRaw('EXTRACT(YEAR FROM lr.date_from) = EXTRACT(YEAR FROM CURRENT_DATE)')
        .select('lt.name as leave_type')
        .sum('lr.num_days as total')
        .groupBy('lt.name')
        .orderBy('total', 'desc');

      // Certificate requests
      const certificateStats = await db('certificates')
        .select('status')
        .count('* as count')
        .groupBy('status');

      // Recent activities
      const recentActivities = await db('audit_logs')
        .join('users', 'audit_logs.user_id', 'users.id')
        .select(
          'audit_logs.*',
          'users.username'
        )
        .orderBy('audit_logs.created_at', 'desc')
        .limit(20);

      return {
        systemOverview: {
          totalEmployees: parseInt(totalEmployees?.count ?? 0),
          activeUsers: parseInt(activeUsers?.count ?? 0),
          pendingApprovals: parseInt((pendingApprovals?.count ?? 0)) + parseInt((pendingLeaves?.count ?? 0))
        },
        leaveStatistics: {
          totalDays: (Array.isArray(leaveStats) ? leaveStats : []).reduce((sum, s) => sum + parseFloat(s?.total ?? 0), 0),
          mostUsedType: (Array.isArray(leaveStats) && leaveStats.length > 0 && leaveStats[0]?.leave_type) ? leaveStats[0].leave_type : 'N/A',
          byType: (Array.isArray(leaveStats) ? leaveStats : []).map(s => ({
            type: s?.leave_type ?? 'N/A',
            days: parseFloat(s?.total ?? 0)
          }))
        },
        certificateRequests: {
          pending: (Array.isArray(certificateStats) ? certificateStats : []).find(s => s.status === 'Pending')?.count ?? 0,
          completed: (Array.isArray(certificateStats) ? certificateStats : []).find(s => s.status === 'Issued')?.count ?? 0
        },
        recentActivities: (Array.isArray(recentActivities) ? recentActivities : []).map(a => ({
          id: a.id,
          username: a.username ?? 'unknown',
          module: a.module ?? 'general',
          action: a.action ?? 'view',
          entityType: a.entity_type ?? 'unknown',
          timestamp: a.created_at
        }))
      };
    } catch (error) {
      logger.error(`Get HR admin dashboard error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get system admin dashboard data
   * @returns {Promise<Object>}
   */
  async getSystemAdminDashboard() {
    try {
      // Get HR admin data first
      const hrData = await this.getHRAdminDashboard();

      // System health
      const dbSize = await db.raw("SELECT pg_size_pretty(pg_database_size(current_database())) as size");
      
      const activeSessions = await db('users')
        .where({ status: 'active' })
        .whereNotNull('last_login')
        .where('last_login', '>=', db.raw("CURRENT_TIMESTAMP - INTERVAL '1 hour'"))
        .count('* as count')
        .first();

      const errorCount = await db('audit_logs')
        .where('created_at', '>=', db.raw("CURRENT_TIMESTAMP - INTERVAL '24 hours'"))
        .whereRaw("details::text LIKE '%error%'")
        .count('* as count')
        .first();

      // User activity
      const loginsToday = await db('users')
        .whereRaw("DATE(last_login) = CURRENT_DATE")
        .count('* as count')
        .first();

      const mostActiveUsers = await db('audit_logs')
        .join('users', 'audit_logs.user_id', 'users.id')
        .where('audit_logs.created_at', '>=', db.raw("CURRENT_TIMESTAMP - INTERVAL '7 days'"))
        .select('users.username')
        .count('* as actions')
        .groupBy('users.username')
        .orderBy('actions', 'desc')
        .limit(5);

      return {
        ...hrData,
        systemHealth: {
          databaseSize: dbSize.rows[0]?.size || 'N/A',
          activeSessions: parseInt(activeSessions?.count ?? 0),
          errorCount: parseInt(errorCount?.count ?? 0)
        },
        userActivity: {
          loginsToday: parseInt(loginsToday?.count ?? 0),
          mostActiveUsers: mostActiveUsers.map(u => ({
            username: u.username,
            actions: parseInt(u.actions)
          }))
        }
      };
    } catch (error) {
      logger.error(`Get system admin dashboard error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new DashboardService();

