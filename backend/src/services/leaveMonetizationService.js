const db = require('../config/database')
const auditLogService = require('./auditLogService')
const logger = require('../config/logger')

class LeaveMonetizationService {
  async calculate(employeeId, retirementDate, dailyRate) {
    try {
      // Get VL and SL balances
      const balances = await db('leave_balances')
        .join('leave_types', 'leave_balances.leave_type_id', 'leave_types.id')
        .where('leave_balances.employee_id', employeeId)
        .select('leave_types.code', 'leave_balances.current_balance')

      let vl = 0, sl = 0
      for (const b of balances) {
        if (b.code === 'VL') vl = parseFloat(b.current_balance)
        if (b.code === 'SL') sl = parseFloat(b.current_balance)
      }
      const totalDays = Math.min(300, vl + sl)
      const totalAmount = Number((totalDays * parseFloat(dailyRate)).toFixed(2))
      return { vlBalance: vl, slBalance: sl, totalDays, dailyRate: parseFloat(dailyRate), totalAmount }
    } catch (error) {
      logger.error(`Monetization calculate error: ${error.message}`)
      throw error
    }
  }

  async createRecord(employeeId, retirementDate, dailyRate, userId, ipAddress, userAgent) {
    const trx = await db.transaction()
    try {
      const preview = await this.calculate(employeeId, retirementDate, dailyRate)
      const [id] = await trx('leave_monetizations').insert({
        employee_id: employeeId,
        retirement_date: retirementDate,
        vl_balance: preview.vlBalance,
        sl_balance: preview.slBalance,
        total_days: preview.totalDays,
        daily_rate: preview.dailyRate,
        total_amount: preview.totalAmount,
        created_by: userId
      }).returning('id')

      await auditLogService.log({
        user_id: userId,
        action: 'CREATE_LEAVE_MONETIZATION',
        module: 'Leave Management',
        entity_type: 'leave_monetization',
        entity_id: Array.isArray(id) ? id[0].id || id[0] : id,
        details: { employeeId, retirementDate, dailyRate: preview.dailyRate, totalAmount: preview.totalAmount },
        ip_address: ipAddress,
        user_agent: userAgent
      })

      await trx.commit()
      return { id: Array.isArray(id) ? id[0].id || id[0] : id, ...preview }
    } catch (error) {
      await trx.rollback()
      logger.error(`Monetization create error: ${error.message}`)
      throw error
    }
  }

  async listHistory(employeeId) {
    const rows = await db('leave_monetizations').where({ employee_id: employeeId }).orderBy('created_at', 'desc')
    return rows.map(r => ({
      id: r.id,
      employeeId: r.employee_id,
      retirementDate: r.retirement_date,
      vlBalance: parseFloat(r.vl_balance),
      slBalance: parseFloat(r.sl_balance),
      totalDays: parseFloat(r.total_days),
      dailyRate: parseFloat(r.daily_rate),
      totalAmount: parseFloat(r.total_amount),
      createdAt: r.created_at
    }))
  }
}

module.exports = new LeaveMonetizationService()

