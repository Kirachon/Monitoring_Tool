const reportService = require('../services/reportService')
const logger = require('../config/logger')

class ReportController {
  async passSlips(req, res){
    try {
      const data = await reportService.passSlipReport(req.query)
      return res.status(200).json({ success: true, data })
    } catch (e){
      logger.error(`Pass slip report error: ${e.message}`)
      return res.status(400).json({ success: false, error: { code: 'REPORT_ERROR', message: e.message } })
    }
  }
  async passSlipsExport(req, res){
    try{
      const { rows } = await reportService.passSlipReport(req.query)
      const csv = reportService.passSlipCsv(rows)
      res.setHeader('Content-Type','text/csv')
      res.setHeader('Content-Disposition','attachment; filename="pass_slips.csv"')
      return res.status(200).send(csv)
    } catch(e){
      logger.error(`Pass slip export error: ${e.message}`)
      return res.status(400).json({ success: false, error: { code: 'EXPORT_ERROR', message: e.message } })
    }
  }

  async leave(req, res){
    try { const data = await reportService.leaveReport(req.query); return res.status(200).json({ success: true, data }) }
    catch(e){ logger.error(`Leave report error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'REPORT_ERROR', message: e.message } }) }
  }
  async leaveExport(req, res){
    try{ const { rows } = await reportService.leaveReport(req.query); const csv = reportService.leaveCsv(rows); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="leave_report.csv"'); return res.status(200).send(csv) }
    catch(e){ logger.error(`Leave export error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'EXPORT_ERROR', message: e.message } }) }
  }

  async certificates(req, res){
    try { const data = await reportService.certificateReport(req.query); return res.status(200).json({ success: true, data }) }
    catch(e){ logger.error(`Certificate report error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'REPORT_ERROR', message: e.message } }) }
  }
  async certificatesExport(req, res){
    try{ const { rows } = await reportService.certificateReport(req.query); const csv = reportService.certificateCsv(rows); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="certificates.csv"'); return res.status(200).send(csv) }
    catch(e){ logger.error(`Certificate export error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'EXPORT_ERROR', message: e.message } }) }
  }

  async auditLogs(req, res){
    try { const data = await reportService.auditLogs(req.query); return res.status(200).json({ success: true, data }) }
    catch(e){ logger.error(`Audit logs report error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'REPORT_ERROR', message: e.message } }) }
  }
  async auditLogsExport(req, res){
    try{ const { rows } = await reportService.auditLogs(req.query); const csv = reportService.auditCsv(rows); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="audit_logs.csv"'); return res.status(200).send(csv) }
    catch(e){ logger.error(`Audit logs export error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'EXPORT_ERROR', message: e.message } }) }
  }

  async employees(req, res){
    try { const data = await reportService.employeeReport(req.query); return res.status(200).json({ success: true, data }) }
    catch(e){ logger.error(`Employee report error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'REPORT_ERROR', message: e.message } }) }
  }
  async employeesExport(req, res){
    try{ const { rows } = await reportService.employeeReport(req.query); const csv = reportService.employeeCsv(rows); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="employees.csv"'); return res.status(200).send(csv) }
    catch(e){ logger.error(`Employees export error: ${e.message}`); return res.status(400).json({ success: false, error: { code: 'EXPORT_ERROR', message: e.message } }) }
  }
}

module.exports = new ReportController()

