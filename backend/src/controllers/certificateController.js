/**
 * Certificate Controller
 * Handles certificate management HTTP requests
 */

const certificateService = require('../services/certificateService');
const logger = require('../config/logger');

class CertificateController {
  /**
   * Get all certificate templates
   * GET /api/certificates/templates
   */
  async getTemplates(req, res) {
    try {
      const templates = await certificateService.getTemplates();
      
      return res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      logger.error(`Get templates error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_TEMPLATES_FAILED',
          message: 'Failed to fetch certificate templates'
        }
      });
    }
  }

  /**
   * Get template by ID
   * GET /api/certificates/templates/:id
   */
  async getTemplateById(req, res) {
    try {
      const { id } = req.params;
      const template = await certificateService.getTemplateById(parseInt(id));
      
      return res.status(200).json({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error(`Get template by ID error: ${error.message}`);
      
      const statusCode = error.message === 'Template not found' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        error: {
          code: error.message === 'Template not found' ? 'TEMPLATE_NOT_FOUND' : 'FETCH_TEMPLATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Create certificate template
   * POST /api/certificates/templates
   */
  async createTemplate(req, res) {
    try {
      const { name, type, content, placeholders } = req.body;
      
      if (!name || !type || !content) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name, type, and content are required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const template = await certificateService.createTemplate(
        { name, type, content, placeholders },
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: template
      });
    } catch (error) {
      logger.error(`Create template error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_TEMPLATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Update certificate template
   * PUT /api/certificates/templates/:id
   */
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const { name, type, content, placeholders } = req.body;
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const template = await certificateService.updateTemplate(
        parseInt(id),
        { name, type, content, placeholders },
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Certificate template updated successfully',
        data: template
      });
    } catch (error) {
      logger.error(`Update template error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_TEMPLATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Duplicate certificate template
   * POST /api/certificates/templates/:id/duplicate
   */
  async duplicateTemplate(req, res) {
    try {
      const { id } = req.params;
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const template = await certificateService.duplicateTemplate(
        parseInt(id),
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        message: 'Certificate template duplicated successfully',
        data: template
      });
    } catch (error) {
      logger.error(`Duplicate template error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_TEMPLATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Delete certificate template
   * DELETE /api/certificates/templates/:id
   */
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      await certificateService.deleteTemplate(
        parseInt(id),
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Certificate template deleted successfully'
      });
    } catch (error) {
      logger.error(`Delete template error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_TEMPLATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Preview certificate with employee data
   * POST /api/certificates/preview
   */
  async previewCertificate(req, res) {
    try {
      const { employeeId, templateId, signatoryId } = req.body;

      if (!employeeId || !templateId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Employee ID and template ID are required'
          }
        });
      }

      // Get template
      const template = await certificateService.getTemplateById(parseInt(templateId));

      // Get employee data
      const employeeData = await certificateService.getEmployeeData(parseInt(employeeId));

      // Get signatory data if provided
      let signatoryData = {
        signatory_name: 'HR Manager',
        signatory_title: 'Human Resources Manager'
      };

      if (signatoryId) {
        const db = require('../config/database');
        const signatory = await db('employees')
          .where({ id: parseInt(signatoryId) })
          .first();

        if (signatory) {
          signatoryData = {
            signatory_name: `${signatory.first_name} ${signatory.last_name}`,
            signatory_title: signatory.position
          };
        }
      }

      // Combine all data
      const data = { ...employeeData, ...signatoryData };

      // Replace placeholders
      const content = certificateService.replacePlaceholders(template.content, data);

      return res.status(200).json({
        success: true,
        data: {
          content,
          employeeData,
          signatoryData
        }
      });
    } catch (error) {
      logger.error(`Preview certificate error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'PREVIEW_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Generate certificate PDF
   * POST /api/certificates/generate
   */
  async generateCertificate(req, res) {
    try {
      const { employeeId, templateId, signatoryId } = req.body;

      if (!employeeId || !templateId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Employee ID and template ID are required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';

      const certificate = await certificateService.generateCertificate(
        { employeeId: parseInt(employeeId), templateId: parseInt(templateId), signatoryId: signatoryId ? parseInt(signatoryId) : null },
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(201).json({
        success: true,
        message: 'Certificate generated successfully',
        data: certificate
      });
    } catch (error) {
      logger.error(`Generate certificate error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Download certificate PDF
   * GET /api/certificates/:id/download
   */
  async downloadCertificate(req, res) {
    try {
      const { id } = req.params;
      const db = require('../config/database');

      const certificate = await db('certificates')
        .where({ id: parseInt(id) })
        .first();

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CERTIFICATE_NOT_FOUND',
            message: 'Certificate not found'
          }
        });
      }

      const path = require('path');
      const filepath = path.join(__dirname, '../../certificates', path.basename(certificate.file_path_pdf));

      return res.download(filepath, `${certificate.reference_no}.pdf`);
    } catch (error) {
      logger.error(`Download certificate error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'DOWNLOAD_FAILED',
          message: 'Failed to download certificate'
        }
      });
    }
  }

  /**
   * Get certificate issuance log
   * GET /api/certificates
   */
  async getCertificates(req, res) {
    try {
      const { search, status, dateFrom, dateTo } = req.query;

      const certificates = await certificateService.getCertificates({
        search,
        status,
        dateFrom,
        dateTo
      });

      return res.status(200).json({
        success: true,
        data: certificates
      });
    } catch (error) {
      logger.error(`Get certificates error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CERTIFICATES_FAILED',
          message: 'Failed to fetch certificates'
        }
      });
    }
  }

  /**
   * Revoke certificate
   * PUT /api/certificates/:id/revoke
   */
  async revokeCertificate(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Revocation reason is required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';

      await certificateService.revokeCertificate(
        parseInt(id),
        reason,
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        message: 'Certificate revoked successfully'
      });
    } catch (error) {
      logger.error(`Revoke certificate error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'REVOKE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Batch generate certificates
   * POST /api/certificates/batch-generate
   */
  async batchGenerate(req, res) {
    try {
      const { employeeIds, templateId, signatoryId } = req.body;
      if (!Array.isArray(employeeIds) || employeeIds.length === 0 || !templateId) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'employeeIds[] and templateId are required' } });
      }
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      const results = await certificateService.batchGenerateCertificates(
        { employeeIds: employeeIds.map(Number), templateId: Number(templateId), signatoryId: signatoryId ? Number(signatoryId) : null },
        req.user.id,
        ipAddress,
        userAgent
      );
      return res.status(200).json({ success: true, data: { results } });
    } catch (error) {
      logger.error(`Batch generate certificates error: ${error.message}`);
      return res.status(400).json({ success: false, error: { code: 'BATCH_GENERATE_FAILED', message: error.message } });
    }
  }

  /**
   * Request a certificate (for employees)
   * POST /api/certificates/request
   */
  async requestCertificate(req, res) {
    try {
      const { certificateType, purpose, additionalDetails } = req.body;

      if (!certificateType || !purpose) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Certificate type and purpose are required'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';

      const request = await certificateService.createCertificateRequest(
        {
          certificateType,
          purpose,
          additionalDetails
        },
        req.user.id,
        ipAddress,
        userAgent
      );

      return res.status(201).json({
        success: true,
        message: 'Certificate request submitted successfully',
        data: request
      });
    } catch (error) {
      logger.error(`Request certificate error: ${error.message}`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'REQUEST_CERTIFICATE_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Get my certificate requests
   * GET /api/certificates/my-requests
   */
  async getMyCertificateRequests(req, res) {
    try {
      const requests = await certificateService.getMyCertificateRequests(req.user.id);

      return res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      logger.error(`Get my certificate requests error: ${error.message}`);

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_REQUESTS_FAILED',
          message: 'Failed to fetch certificate requests'
        }
      });
    }
  }
}

module.exports = new CertificateController();

