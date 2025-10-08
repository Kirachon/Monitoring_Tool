/**
 * Digital Signature Routes
 * Defines routes for digital signature management endpoints
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const signatureController = require('../controllers/signatureController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 // 500KB
  }
});

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/signatures
 * Get all digital signatures
 */
router.get('/', requirePermission('certificate.generate'), signatureController.getSignatures);

/**
 * GET /api/signatures/:employeeId
 * Get signature by employee ID
 */
router.get('/:employeeId', requirePermission('certificate.generate'), signatureController.getSignatureByEmployeeId);

/**
 * POST /api/signatures
 * Upload digital signature
 */
router.post('/', requirePermission('certificate.manage_templates'), upload.single('signature'), signatureController.uploadSignature);

/**
 * DELETE /api/signatures/:employeeId
 * Delete digital signature
 */
router.delete('/:employeeId', requirePermission('certificate.manage_templates'), signatureController.deleteSignature);

module.exports = router;

