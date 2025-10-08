const leaveMonetizationService = require('../services/leaveMonetizationService')
const logger = require('../config/logger')
const db = require('../config/database')
const puppeteer = require('puppeteer')

class LeaveMonetizationController {
  async preview(req, res) {
    try {
      const { employeeId, retirementDate, dailyRate } = req.body
      if (!employeeId || !retirementDate || !dailyRate) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'employeeId, retirementDate, and dailyRate are required' } })
      }
      const data = await leaveMonetizationService.calculate(parseInt(employeeId), retirementDate, dailyRate)
      return res.status(200).json({ success: true, data })
    } catch (error) {
      logger.error(`Monetization preview error: ${error.message}`)
      return res.status(500).json({ success: false, error: { code: 'PREVIEW_FAILED', message: 'Failed to calculate monetization' } })
    }
  }

  async create(req, res) {
    try {
      const { employeeId, retirementDate, dailyRate } = req.body
      if (!employeeId || !retirementDate || !dailyRate) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'employeeId, retirementDate, and dailyRate are required' } })
      }
      const data = await leaveMonetizationService.createRecord(
        parseInt(employeeId),
        retirementDate,
        dailyRate,
        req.user.id,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || ''
      )
      return res.status(201).json({ success: true, data })
    } catch (error) {
      logger.error(`Monetization create error: ${error.message}`)
      return res.status(500).json({ success: false, error: { code: 'CREATE_FAILED', message: 'Failed to create monetization record' } })
    }
  }

  async history(req, res) {
    try {
      const { employeeId } = req.query
      if (!employeeId) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'employeeId is required' } })
      const data = await leaveMonetizationService.listHistory(parseInt(employeeId))
      return res.status(200).json({ success: true, data })
    } catch (error) {
      logger.error(`Monetization history error: ${error.message}`)
      return res.status(500).json({ success: false, error: { code: 'HISTORY_FAILED', message: 'Failed to fetch monetization history' } })
    }
  }

  async report(req, res) {
    try {
      const { id } = req.params
      const rec = await db('leave_monetizations')
        .join('employees', 'leave_monetizations.employee_id', 'employees.id')
        .select(
          'leave_monetizations.*',
          'employees.employee_no',
          'employees.first_name',
          'employees.last_name',
          'employees.middle_name',
          'employees.position_title'
        )
        .where({ 'leave_monetizations.id': id })
        .first()
      if (!rec) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } })

      const fullName = `${rec.last_name}, ${rec.first_name}${rec.middle_name ? ' ' + rec.middle_name : ''}`
      const html = `<!doctype html>
        <html><head><meta charset=\"utf-8\" />
        <style>
          body{ font-family: Arial, sans-serif; font-size:12px; }
          .title{ text-align:center; font-size:18px; font-weight:bold; margin-bottom:10px }
          table{ width:100%; border-collapse:collapse; margin-top:10px }
          th,td{ border:1px solid #888; padding:6px; }
          .right{ text-align:right }
        </style></head>
        <body>
          <div class=\"title\">Leave Monetization Calculation</div>
          <table>
            <tr><th>Employee No.</th><td>${rec.employee_no || ''}</td><th>Name</th><td>${fullName}</td></tr>
            <tr><th>Position</th><td>${rec.position_title || ''}</td><th>Retirement Date</th><td>${rec.retirement_date}</td></tr>
          </table>
          <table>
            <tr><th>VL Balance</th><td class=\"right\">${Number(rec.vl_balance).toFixed(2)}</td></tr>
            <tr><th>SL Balance</th><td class=\"right\">${Number(rec.sl_balance).toFixed(2)}</td></tr>
            <tr><th>Total Monetizable Days</th><td class=\"right\">${Number(rec.total_days).toFixed(2)}</td></tr>
            <tr><th>Daily Rate (PHP)</th><td class=\"right\">${Number(rec.daily_rate).toFixed(2)}</td></tr>
            <tr><th>Total Amount (PHP)</th><td class=\"right\"><strong>${Number(rec.total_amount).toFixed(2)}</strong></td></tr>
          </table>
          <p style=\"margin-top:16px; font-size:11px;\">Disclaimer: Subject to final verification and approval by the Civil Service Commission.</p>
        </body></html>`

      const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      const pdf = await page.pdf({ format: 'A4', printBackground: true })
      await browser.close()

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=leave_monetization_${id}.pdf`)
      return res.status(200).send(pdf)
    } catch (error) {
      logger.error(`Monetization report error: ${error.message}`)
      return res.status(500).json({ success: false, error: { code: 'REPORT_FAILED', message: 'Failed to generate report' } })
    }
  }
}

module.exports = new LeaveMonetizationController()

