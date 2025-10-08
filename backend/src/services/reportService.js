const db = require('../config/database')

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const r of rows) lines.push(headers.map(h => JSON.stringify(r[h] ?? '')).join(','))
  return lines.join('\n')
}

class ReportService {
  // 6.2 Pass Slip Reports
  async passSlipReport(filters = {}) {
    const { dateFrom, dateTo, status, departmentId, employeeId } = filters
    let q = db('pass_slips as ps')
      .leftJoin('employees as e', 'ps.employee_id', 'e.id')
      .leftJoin('departments as d', 'e.department_id', 'd.id')
      .select(
        'ps.id','ps.reference_no as referenceNo','ps.time_out as timeOut','ps.actual_time_in as timeIn','ps.status',
        'e.id as employeeId', db.raw("CONCAT(e.last_name, ', ', e.first_name) as employeeName"),
        'd.id as departmentId','d.name as departmentName','ps.created_at as createdAt'
      )
    if (dateFrom) q = q.where('ps.created_at','>=',dateFrom)
    if (dateTo) q = q.where('ps.created_at','<=',dateTo)
    if (status) q = q.where('ps.status', status)
    if (departmentId) q = q.where('d.id', departmentId)
    if (employeeId) q = q.where('e.id', employeeId)
    const rows = await q.orderBy('ps.created_at','desc')
    const summary = {
      total: rows.length,
      pending: rows.filter(r=>r.status==='Pending').length,
      approved: rows.filter(r=>r.status==='Approved').length,
      denied: rows.filter(r=>r.status==='Denied').length
    }
    return { summary, rows }
  }
  passSlipCsv(rows) { return toCsv(rows) }

  // 6.3 Leave Reports (CSC Compliance)
  async leaveReport({ year, employeeId, departmentId } = {}) {
    const yr = year || new Date().getFullYear()
    const from = `${yr}-01-01`, to = `${yr}-12-31`

    // Summary per employee for VL/SL
    let empQ = db('employees as e')
      .leftJoin('departments as d','e.department_id','d.id')
      .select('e.id as employeeId', db.raw("CONCAT(e.last_name, ', ', e.first_name) as employeeName"), 'd.name as departmentName')
    if (employeeId) empQ = empQ.where('e.id', employeeId)
    if (departmentId) empQ = empQ.where('d.id', departmentId)
    const employees = await empQ

    const results = []
    for (const emp of employees) {
      const balances = await db('leave_balances as lb').join('leave_types as lt','lb.leave_type_id','lt.id').where('lb.employee_id', emp.employeeId).select('lt.code','lb.current_balance')
      const vlBal = parseFloat(balances.find(b=>b.code==='VL')?.current_balance || 0)
      const slBal = parseFloat(balances.find(b=>b.code==='SL')?.current_balance || 0)

      const credits = await db('leave_credits')
        .where({ employee_id: emp.employeeId })
        .whereBetween('created_at',[from,to])
        .select('transaction_type','amount')
      const accrued = credits.filter(c=>c.transaction_type==='Accrual').reduce((s,c)=>s+Number(c.amount||0),0)
      const used = credits.filter(c=>['Usage','Leave Approved'].includes(c.transaction_type)).reduce((s,c)=>s+Math.abs(Number(c.amount||0)),0)

      results.push({
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        departmentName: emp.departmentName,
        year: yr,
        vlEndingBalance: vlBal,
        slEndingBalance: slBal,
        accruedYtd: Number(accrued.toFixed(2)),
        usedYtd: Number(used.toFixed(2))
      })
    }
    return { year: yr, rows: results }
  }
  leaveCsv(rows) { return toCsv(rows) }

  // 6.4 Certificate Reports
  async certificateReport({ dateFrom, dateTo, type } = {}) {
    let q = db('certificates as c')
      .leftJoin('employees as e','c.employee_id','e.id')
      .leftJoin('certificate_templates as ct','c.template_id','ct.id')
      .select('c.id','c.reference_no as referenceNo','c.issued_date as issuedDate','c.status','ct.name as templateName','ct.certificate_type as certificateType', db.raw("CONCAT(e.last_name, ', ', e.first_name) as employeeName"))
    if (dateFrom) q = q.where('c.issued_date','>=',dateFrom)
    if (dateTo) q = q.where('c.issued_date','<=',dateTo)
    if (type) q = q.where('ct.certificate_type', type)
    const rows = await q.orderBy('c.issued_date','desc')
    const summary = { total: rows.length }
    return { summary, rows }
  }
  certificateCsv(rows){ return toCsv(rows) }

  // 6.5 Audit Log Viewer
  async auditLogs(filters = {}){
    const { module, action, userId, dateFrom, dateTo } = filters
    let q = db('audit_logs as a')
      .leftJoin('users as u','a.user_id','u.id')
      .select('a.id','a.module','a.action','a.entity_type as entityType','a.entity_id as entityId','a.details','a.ip_address as ip','a.user_agent as ua','a.created_at as createdAt','u.username')
    if (module) q = q.where('a.module', module)
    if (action) q = q.where('a.action', action)
    if (userId) q = q.where('a.user_id', userId)
    if (dateFrom) q = q.where('a.created_at','>=',dateFrom)
    if (dateTo) q = q.where('a.created_at','<=',dateTo)
    const rows = await q.orderBy('a.created_at','desc')
    return { rows }
  }
  auditCsv(rows){ return toCsv(rows) }

  // 6.6 Employee Reports
  async employeeReport({ departmentId, status, dateFrom, dateTo } = {}){
    let q = db('employees as e').leftJoin('departments as d','e.department_id','d.id')
      .select('e.id as employeeId', db.raw("CONCAT(e.last_name, ', ', e.first_name) as employeeName"),'d.name as departmentName','e.position as position','e.status','e.date_hired as dateHired','e.date_separated as dateSeparated')
    if (departmentId) q = q.where('d.id', departmentId)
    if (status) q = q.where('e.status', status)
    if (dateFrom) q = q.where('e.created_at','>=',dateFrom)
    if (dateTo) q = q.where('e.created_at','<=',dateTo)
    const rows = await q.orderBy('e.last_name','asc')

    // simple aggregates
    const headcountByDept = {}
    for (const r of rows) headcountByDept[r.departmentName] = (headcountByDept[r.departmentName]||0)+1
    const summary = { total: rows.length, headcountByDept }
    return { summary, rows }
  }
  employeeCsv(rows){ return toCsv(rows) }
}

module.exports = new ReportService()

