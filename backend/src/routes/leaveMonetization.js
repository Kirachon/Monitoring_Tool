const express = require('express')
const router = express.Router()
const { authenticate, requirePermission } = require('../middleware/auth')
const controller = require('../controllers/leaveMonetizationController')

router.use(authenticate)

// Preview calculation
router.post('/preview', requirePermission('leave.manage'), controller.preview)

// Create monetization record
router.post('/', requirePermission('leave.manage'), controller.create)

// History
router.get('/history', requirePermission('leave.manage'), controller.history)

// Report PDF
router.get('/:id/report', requirePermission('leave.manage'), controller.report)

module.exports = router

