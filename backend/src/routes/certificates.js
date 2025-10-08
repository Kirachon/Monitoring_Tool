/**
 * Certificate Routes
 * Defines routes for certificate management endpoints
 */

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, requirePermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/certificates
 * Get certificate issuance log
 */
router.get('/', requirePermission('certificate.generate'), certificateController.getCertificates);

/**
 * GET /api/certificates/templates
 * Get all certificate templates
 */
router.get('/templates', requirePermission('certificate.manage_templates'), certificateController.getTemplates);

/**
 * GET /api/certificates/templates/:id
 * Get template by ID
 */
router.get('/templates/:id', requirePermission('certificate.manage_templates'), certificateController.getTemplateById);

/**
 * POST /api/certificates/templates
 * Create new certificate template
 */
router.post('/templates', requirePermission('certificate.manage_templates'), certificateController.createTemplate);

/**
 * PUT /api/certificates/templates/:id
 * Update certificate template
 */
router.put('/templates/:id', requirePermission('certificate.manage_templates'), certificateController.updateTemplate);

/**
 * POST /api/certificates/templates/:id/duplicate
 * Duplicate certificate template
 */
router.post('/templates/:id/duplicate', requirePermission('certificate.manage_templates'), certificateController.duplicateTemplate);

/**
 * DELETE /api/certificates/templates/:id
 * Delete certificate template
 */
router.delete('/templates/:id', requirePermission('certificate.manage_templates'), certificateController.deleteTemplate);

/**
 * POST /api/certificates/request
 * Request a certificate (for employees)
 */
router.post('/request', requirePermission('certificate.request'), certificateController.requestCertificate);

/**
 * GET /api/certificates/my-requests
 * Get my certificate requests
 */
router.get('/my-requests', requirePermission('certificate.request'), certificateController.getMyCertificateRequests);

/**
 * POST /api/certificates/preview
 * Preview certificate with employee data
 */
router.post('/preview', requirePermission('certificate.generate'), certificateController.previewCertificate);

/**
 * POST /api/certificates/generate
 * Generate certificate PDF
 */
router.post('/generate', requirePermission('certificate.generate'), certificateController.generateCertificate);

// Batch generate certificates
router.post('/batch-generate', requirePermission('certificate.generate'), certificateController.batchGenerate);

/**
 * GET /api/certificates/:id/download
 * Download certificate PDF
 */
router.get('/:id/download', requirePermission('certificate.generate'), certificateController.downloadCertificate);

/**
 * PUT /api/certificates/:id/revoke
 * Revoke certificate
 */
router.put('/:id/revoke', requirePermission('certificate.generate'), certificateController.revokeCertificate);

module.exports = router;

