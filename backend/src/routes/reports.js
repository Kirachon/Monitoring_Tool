const express = require('express')
const router = express.Router()
const { authenticate, requirePermission } = require('../middleware/auth')
const reportController = require('../controllers/reportController')

router.use(authenticate)

// 6.2 Pass Slip Reports
router.get('/pass-slips', requirePermission('reports.view'), reportController.passSlips)
router.get('/pass-slips/export', requirePermission('reports.export'), reportController.passSlipsExport)

// 6.3 Leave Reports (CSC Compliance)
router.get('/leave', requirePermission('reports.view'), reportController.leave)
router.get('/leave/export', requirePermission('reports.export'), reportController.leaveExport)

// 6.4 Certificate Reports
router.get('/certificates', requirePermission('reports.view'), reportController.certificates)
router.get('/certificates/export', requirePermission('reports.export'), reportController.certificatesExport)

// 6.5 Audit Log Viewer
router.get('/audit-logs', requirePermission('system.audit_log'), reportController.auditLogs)
router.get('/audit-logs/export', requirePermission('system.audit_log'), reportController.auditLogsExport)

// 6.6 Employee Reports
router.get('/employees', requirePermission('reports.view'), reportController.employees)
router.get('/employees/export', requirePermission('reports.export'), reportController.employeesExport)

module.exports = router

