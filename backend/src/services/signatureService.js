/**
 * Digital Signature Service
 * Handles digital signature management business logic
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');
const path = require('path');
const fs = require('fs').promises;

class SignatureService {
  /**
   * Get all digital signatures
   * @returns {Promise<Array>}
   */
  async getSignatures() {
    try {
      const signatures = await db('digital_signatures as ds')
        .join('employees as e', 'ds.employee_id', 'e.id')
        .select(
          'ds.*',
          'e.first_name',
          'e.last_name',
          'e.employee_id as employee_number',
          'e.position'
        )
        .orderBy('e.last_name', 'asc');
      
      return signatures.map(s => ({
        id: s.id,
        employeeId: s.employee_id,
        employeeName: `${s.first_name} ${s.last_name}`,
        employeeNumber: s.employee_number,
        position: s.position,
        signaturePath: s.signature_path,
        signatureTitle: s.signature_title,
        uploadedAt: s.uploaded_at
      }));
    } catch (error) {
      logger.error(`Get signatures error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get signature by employee ID
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Object>}
   */
  async getSignatureByEmployeeId(employeeId) {
    try {
      const signature = await db('digital_signatures')
        .where({ employee_id: employeeId })
        .first();
      
      if (!signature) {
        return null;
      }

      return {
        id: signature.id,
        employeeId: signature.employee_id,
        signaturePath: signature.signature_path,
        signatureTitle: signature.signature_title,
        uploadedAt: signature.uploaded_at
      };
    } catch (error) {
      logger.error(`Get signature by employee ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload digital signature
   * @param {Object} signatureData - Signature data
   * @param {Object} file - Uploaded file
   * @param {number} uploadedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async uploadSignature(signatureData, file, uploadedBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const { employeeId, signatureTitle } = signatureData;

      // Ensure signatures directory exists
      const signaturesDir = path.join(__dirname, '../../signatures');
      await fs.mkdir(signaturesDir, { recursive: true });

      // Generate unique filename
      const ext = path.extname(file.originalname);
      const filename = `signature-${employeeId}-${Date.now()}${ext}`;
      const filepath = path.join(signaturesDir, filename);

      // Move file to signatures directory
      await fs.writeFile(filepath, file.buffer);

      // Check if signature already exists
      const existing = await trx('digital_signatures')
        .where({ employee_id: employeeId })
        .first();

      let signature;
      if (existing) {
        // Update existing signature
        await trx('digital_signatures')
          .where({ employee_id: employeeId })
          .update({
            signature_path: `/signatures/${filename}`,
            signature_title: signatureTitle,
            uploaded_at: db.fn.now(),
            uploaded_by: uploadedBy
          });

        // Delete old signature file
        if (existing.signature_path) {
          const oldFilepath = path.join(__dirname, '../..', existing.signature_path);
          try {
            await fs.unlink(oldFilepath);
          } catch (err) {
            logger.warn(`Failed to delete old signature file: ${err.message}`);
          }
        }

        signature = await trx('digital_signatures')
          .where({ employee_id: employeeId })
          .first();
      } else {
        // Insert new signature
        [signature] = await trx('digital_signatures')
          .insert({
            employee_id: employeeId,
            signature_path: `/signatures/${filename}`,
            signature_title: signatureTitle,
            uploaded_at: db.fn.now(),
            uploaded_by: uploadedBy
          })
          .returning('*');
      }

      // Audit log
      await auditLogService.logCreate(
        uploadedBy,
        'Certificate Management',
        'digital_signature',
        signature.id,
        { employee_id: employeeId, signature_title: signatureTitle },
        ipAddress,
        userAgent
      );

      await trx.commit();
      
      return {
        id: signature.id,
        employeeId: signature.employee_id,
        signaturePath: signature.signature_path,
        signatureTitle: signature.signature_title
      };
    } catch (error) {
      await trx.rollback();
      logger.error(`Upload signature error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete digital signature
   * @param {number} employeeId - Employee ID
   * @param {number} deletedBy - User ID
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async deleteSignature(employeeId, deletedBy, ipAddress, userAgent) {
    const trx = await db.transaction();
    
    try {
      const signature = await trx('digital_signatures')
        .where({ employee_id: employeeId })
        .first();

      if (!signature) {
        throw new Error('Signature not found');
      }

      // Delete signature record
      await trx('digital_signatures')
        .where({ employee_id: employeeId })
        .del();

      // Delete signature file
      if (signature.signature_path) {
        const filepath = path.join(__dirname, '../..', signature.signature_path);
        try {
          await fs.unlink(filepath);
        } catch (err) {
          logger.warn(`Failed to delete signature file: ${err.message}`);
        }
      }

      // Audit log
      await auditLogService.logDelete(
        deletedBy,
        'Certificate Management',
        'digital_signature',
        signature.id,
        { employee_id: employeeId },
        ipAddress,
        userAgent
      );

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      logger.error(`Delete signature error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new SignatureService();

