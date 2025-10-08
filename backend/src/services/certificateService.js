/**
 * Certificate Service
 * Handles certificate template and generation business logic
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

class CertificateService {
  /**
   * Get all certificate templates
   * @returns {Promise<Array>}
   */
  async getTemplates() {
    try {
      const templates = await db('certificate_templates')
        .where('is_active', true)
        .orderBy('name', 'asc');
      
      return templates.map(t => ({
        id: t.id,
        name: t.name,
        type: t.certificate_type,
        content: t.template_content,
        placeholders: t.placeholders,
        isActive: t.is_active,
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }));
    } catch (error) {
      logger.error(`Get templates error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get template by ID
   * @param {number} id - Template ID
   * @returns {Promise<Object>}
   */
  async getTemplateById(id) {
    try {
      const template = await db('certificate_templates')
        .where({ id })
        .first();
      
      if (!template) {
        throw new Error('Template not found');
      }

      return {
        id: template.id,
        name: template.name,
        type: template.certificate_type,
        content: template.template_content,
        placeholders: template.placeholders,
        isActive: template.is_active,
        createdAt: template.created_at,
        updatedAt: template.updated_at
      };
    } catch (error) {
      logger.error(`Get template by ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create certificate template
   * @param {Object} templateData - Template data
   * @param {number} createdBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createTemplate(templateData, createdBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const { name, type, content, placeholders } = templateData;

      // Check for duplicate name
      const existing = await trx('certificate_templates')
        .where({ name })
        .first();

      if (existing) {
        throw new Error('Template name already exists');
      }

      // Insert template
      const [template] = await trx('certificate_templates')
        .insert({
          name,
          certificate_type: type,
          template_content: content,
          placeholders: JSON.stringify(placeholders || []),
          is_active: true,
          created_by: createdBy,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .returning('*');

      // Audit log
      await auditLogService.logCreate(
        createdBy,
        'Certificate Management',
        'certificate_template',
        template.id,
        { name, type },
        ipAddress,
        userAgent
      );

      await trx.commit();
      
      return {
        id: template.id,
        name: template.name,
        type: template.certificate_type,
        content: template.template_content,
        placeholders: template.placeholders
      };
    } catch (error) {
      await trx.rollback();
      logger.error(`Create template error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update certificate template
   * @param {number} id - Template ID
   * @param {Object} templateData - Template data
   * @param {number} updatedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async updateTemplate(id, templateData, updatedBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const existing = await trx('certificate_templates')
        .where({ id })
        .first();

      if (!existing) {
        throw new Error('Template not found');
      }

      const { name, type, content, placeholders } = templateData;

      // Check for duplicate name (excluding current template)
      if (name && name !== existing.name) {
        const duplicate = await trx('certificate_templates')
          .where({ name })
          .whereNot({ id })
          .first();

        if (duplicate) {
          throw new Error('Template name already exists');
        }
      }

      // Update template
      await trx('certificate_templates')
        .where({ id })
        .update({
          name: name || existing.name,
          certificate_type: type || existing.certificate_type,
          template_content: content || existing.template_content,
          placeholders: placeholders ? JSON.stringify(placeholders) : existing.placeholders,
          updated_at: db.fn.now()
        });

      // Audit log
      await auditLogService.logUpdate(
        updatedBy,
        'Certificate Management',
        'certificate_template',
        id,
        { name: existing.name, type: existing.certificate_type },
        { name: name || existing.name, type: type || existing.certificate_type },
        ipAddress,
        userAgent
      );

      await trx.commit();

      const updated = await this.getTemplateById(id);
      return updated;
    } catch (error) {
      await trx.rollback();
      logger.error(`Update template error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Duplicate certificate template
   * @param {number} id - Template ID to duplicate
   * @param {number} createdBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async duplicateTemplate(id, createdBy, ipAddress, userAgent) {
    try {
      const original = await this.getTemplateById(id);
      
      const duplicateData = {
        name: `${original.name} (Copy)`,
        type: original.type,
        content: original.content,
        placeholders: JSON.parse(original.placeholders || '[]')
      };

      return await this.createTemplate(duplicateData, createdBy, ipAddress, userAgent);
    } catch (error) {
      logger.error(`Duplicate template error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete certificate template (soft delete)
   * @param {number} id - Template ID
   * @param {number} deletedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async deleteTemplate(id, deletedBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const template = await trx('certificate_templates')
        .where({ id })
        .first();

      if (!template) {
        throw new Error('Template not found');
      }

      await trx('certificate_templates')
        .where({ id })
        .update({
          is_active: false,
          updated_at: db.fn.now()
        });

      // Audit log
      await auditLogService.logDelete(
        deletedBy,
        'Certificate Management',
        'certificate_template',
        id,
        { name: template.name },
        ipAddress,
        userAgent
      );

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      logger.error(`Delete template error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate reference number for certificate
   * @returns {Promise<string>}
   */
  async generateReferenceNumber() {
    const year = new Date().getFullYear();
    const lastCert = await db('certificates')
      .where('reference_no', 'like', `CERT-${year}-%`)
      .orderBy('reference_no', 'desc')
      .first();

    let nextNumber = 1;
    if (lastCert) {
      const lastNumber = parseInt(lastCert.reference_no.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `CERT-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Replace placeholders in template with employee data
   * @param {string} template - Template content
   * @param {Object} data - Employee and other data
   * @returns {string}
   */
  replacePlaceholders(template, data) {
    let content = template;

    // Replace all placeholders
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = data[key] || '';
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }

  /**
   * Get employee data for certificate
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Object>}
   */
  async getEmployeeData(employeeId) {
    try {
      const employee = await db('employees as e')
        .leftJoin('departments as d', 'e.department_id', 'd.id')
        .where('e.id', employeeId)
        .select(
          'e.*',
          'd.name as department_name'
        )
        .first();

      if (!employee) {
        throw new Error('Employee not found');
      }

      // Get leave balances
      const vlBalance = await db('leave_balances as lb')
        .join('leave_types as lt', 'lb.leave_type_id', 'lt.id')
        .where('lb.employee_id', employeeId)
        .where('lt.code', 'VL')
        .select('lb.current_balance')
        .first();

      const slBalance = await db('leave_balances as lb')
        .join('leave_types as lt', 'lb.leave_type_id', 'lt.id')
        .where('lb.employee_id', employeeId)
        .where('lt.code', 'SL')
        .select('lb.current_balance')
        .first();

      return {
        employee_name: `${employee.first_name} ${employee.middle_name || ''} ${employee.last_name}`.replace(/\s+/g, ' ').trim(),
        employee_id: employee.employee_id,
        position: employee.position,
        department: employee.department_name,
        date_hired: new Date(employee.date_hired).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        salary_grade: employee.salary_grade || 'N/A',
        vl_balance: vlBalance ? vlBalance.current_balance : 0,
        sl_balance: slBalance ? slBalance.current_balance : 0,
        current_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
    } catch (error) {
      logger.error(`Get employee data error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate certificate PDF
   * @param {Object} params - Generation parameters
   * @returns {Promise<Object>}
   */
  async generateCertificate(params, generatedBy, ipAddress, userAgent) {
    const trx = await db.transaction();

    try {
      const { employeeId, templateId, signatoryId } = params;

      // Get template
      const template = await this.getTemplateById(templateId);

      // Get employee data
      const employeeData = await this.getEmployeeData(employeeId);

      // Get signatory data
      let signatoryData = {
        signatory_name: 'HR Manager',
        signatory_title: 'Human Resources Manager'
      };

      if (signatoryId) {
        const signatory = await trx('employees')
          .where({ id: signatoryId })
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
      const content = this.replacePlaceholders(template.content, data);

      // Generate reference number
      const referenceNo = await this.generateReferenceNumber();

      // Generate PDF
      const pdfPath = await this.generatePDF(content, referenceNo);

      // Insert certificate record
      const [certificate] = await trx('certificates')
        .insert({
          reference_no: referenceNo,
          employee_id: employeeId,
          template_id: templateId,
          signatory_id: signatoryId,
          file_path_pdf: pdfPath,
          status: 'Issued',
          issued_date: db.fn.now(),
          issued_by: generatedBy,
          created_at: db.fn.now()
        })
        .returning('*');

      // Audit log
      await auditLogService.logCreate(
        generatedBy,
        'Certificate Management',
        'certificate',
        certificate.id,
        { reference_no: referenceNo, employee_id: employeeId, template_id: templateId },
        ipAddress,
        userAgent
      );

      await trx.commit();

      return {
        id: certificate.id,
        referenceNo: certificate.reference_no,
        pdfPath: certificate.file_path_pdf,
        content
      };
    } catch (error) {
      await trx.rollback();
      logger.error(`Generate certificate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate PDF from HTML content
   * @param {string} content - HTML content
   * @param {string} referenceNo - Certificate reference number
   * @returns {Promise<string>} - PDF file path
   */
  async generatePDF(content, referenceNo) {
    try {
      // Ensure certificates directory exists
      const certsDir = path.join(__dirname, '../../certificates');
      await fs.mkdir(certsDir, { recursive: true });

      const filename = `${referenceNo}.pdf`;
      const filepath = path.join(certsDir, filename);

      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(content, { waitUntil: 'networkidle0' });

      await page.pdf({
        path: filepath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      await browser.close();

      return `/certificates/${filename}`;
    } catch (error) {
      logger.error(`Generate PDF error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get certificate issuance log
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>}
   */
  async getCertificates(filters = {}) {
    try {
      let query = db('certificates as c')
        .join('employees as e', 'c.employee_id', 'e.id')
        .join('certificate_templates as ct', 'c.template_id', 'ct.id')
        .leftJoin('employees as s', 'c.signatory_id', 's.id')
        .leftJoin('users as u', 'c.issued_by', 'u.id')
        .select(
          'c.*',
          'e.first_name as employee_first_name',
          'e.last_name as employee_last_name',
          'e.employee_id as employee_number',
          'ct.name as template_name',
          'ct.certificate_type',
          db.raw("CONCAT(s.first_name, ' ', s.last_name) as signatory_name"),
          'u.username as issued_by_username'
        );

      // Apply filters
      if (filters.search) {
        query = query.where(function() {
          this.where('e.first_name', 'ilike', `%${filters.search}%`)
            .orWhere('e.last_name', 'ilike', `%${filters.search}%`)
            .orWhere('c.reference_no', 'ilike', `%${filters.search}%`)
            .orWhere('ct.name', 'ilike', `%${filters.search}%`);
        });
      }

      if (filters.status) {
        query = query.where('c.status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.where('c.issued_date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('c.issued_date', '<=', filters.dateTo);
      }

      const certificates = await query.orderBy('c.issued_date', 'desc');

      return certificates.map(c => ({
        id: c.id,
        referenceNo: c.reference_no,
        employeeName: `${c.employee_first_name} ${c.employee_last_name}`,
        employeeNumber: c.employee_number,
        templateName: c.template_name,
        certificateType: c.certificate_type,
        signatoryName: c.signatory_name,
        issuedDate: c.issued_date,
        issuedBy: c.issued_by_username,
        status: c.status,
        revocationReason: c.revocation_reason,
        filePath: c.file_path_pdf
      }));
    } catch (error) {
      logger.error(`Get certificates error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Revoke certificate
   * @param {number} id - Certificate ID
   * @param {string} reason - Revocation reason
   * @param {number} revokedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async revokeCertificate(id, reason, revokedBy, ipAddress, userAgent) {
    const trx = await db.transaction();

    try {
      const certificate = await trx('certificates')
        .where({ id })
        .first();

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      if (certificate.status === 'Revoked') {
        throw new Error('Certificate is already revoked');
      }

      await trx('certificates')
        .where({ id })
        .update({
          status: 'Revoked',
          revocation_reason: reason,
          revoked_at: db.fn.now()
        });

      // Audit log
      await auditLogService.logUpdate(
        revokedBy,
        'Certificate Management',
        'certificate',
        id,
        { status: certificate.status },
        { status: 'Revoked', revocation_reason: reason },
        ipAddress,
        userAgent
      );

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      logger.error(`Revoke certificate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Batch generate certificates for multiple employees
   * @param {Object} params - { employeeIds: number[], templateId: number, signatoryId?: number }
   * @returns {Promise<Array>} - [{ employeeId, success, id?, referenceNo?, error? }]
   */
  async batchGenerateCertificates(params, generatedBy, ipAddress, userAgent) {
    const { employeeIds = [], templateId, signatoryId = null } = params;
    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      throw new Error('employeeIds must be a non-empty array');
    }
    if (!templateId) throw new Error('templateId is required');

    const results = [];
    for (const employeeId of employeeIds) {
      try {
        const cert = await this.generateCertificate({ employeeId, templateId, signatoryId }, generatedBy, ipAddress, userAgent);
        results.push({ employeeId, success: true, id: cert.id, referenceNo: cert.referenceNo });
      } catch (e) {
        logger.error(`Batch generate failed for employee ${employeeId}: ${e.message}`);
        results.push({ employeeId, success: false, error: e.message });
      }
    }
    return results;
  }

  /**
   * Create a certificate request (for employees)
   * @param {Object} requestData - Request data
   * @param {number} userId - User ID making the request
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createCertificateRequest(requestData, userId, ipAddress, userAgent) {
    try {
      const { certificateType, purpose, additionalDetails } = requestData;

      // Get employee ID from user
      const user = await db('users')
        .where({ id: userId })
        .first();

      if (!user || !user.employee_id) {
        throw new Error('Employee record not found for user');
      }

      // Insert certificate request
      const [request] = await db('certificate_requests')
        .insert({
          user_id: userId,
          employee_id: user.employee_id,
          certificate_type: certificateType,
          purpose: purpose,
          additional_details: additionalDetails,
          status: 'Pending',
          requested_at: db.fn.now()
        })
        .returning('*');

      // Audit log
      await auditLogService.logCreate(
        userId,
        'Certificate Management',
        'certificate_request',
        request.id,
        { certificateType, purpose },
        ipAddress,
        userAgent
      );

      logger.info(`Certificate request ${request.id} created by user ${userId}`);

      return {
        id: request.id,
        certificateType: request.certificate_type,
        purpose: request.purpose,
        status: request.status,
        requestedAt: request.requested_at
      };
    } catch (error) {
      logger.error(`Create certificate request error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get certificate requests for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>}
   */
  async getMyCertificateRequests(userId) {
    try {
      const requests = await db('certificate_requests as cr')
        .leftJoin('certificates as c', 'cr.certificate_id', 'c.id')
        .where('cr.user_id', userId)
        .select(
          'cr.id',
          'cr.certificate_type as certificateType',
          'cr.purpose',
          'cr.additional_details as additionalDetails',
          'cr.status',
          'cr.certificate_id as certificateId',
          'cr.denial_reason as denialReason',
          'cr.requested_at as requestedAt',
          'cr.processed_at as processedAt',
          'c.reference_no as certificateReferenceNo'
        )
        .orderBy('cr.requested_at', 'desc');

      return requests;
    } catch (error) {
      logger.error(`Get my certificate requests error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CertificateService();

