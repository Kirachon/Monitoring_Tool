/**
 * Digital Signature Controller
 * Handles digital signature HTTP requests
 */

const signatureService = require('../services/signatureService');
const logger = require('../config/logger');

class SignatureController {
  /**
   * Get all digital signatures
   * GET /api/signatures
   */
  async getSignatures(req, res) {
    try {
      const signatures = await signatureService.getSignatures();
      
      return res.status(200).json({
        success: true,
        data: signatures
      });
    } catch (error) {
      logger.error(`Get signatures error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SIGNATURES_FAILED',
          message: 'Failed to fetch digital signatures'
        }
      });
    }
  }

  /**
   * Get signature by employee ID
   * GET /api/signatures/:employeeId
   */
  async getSignatureByEmployeeId(req, res) {
    try {
      const { employeeId } = req.params;
      const signature = await signatureService.getSignatureByEmployeeId(parseInt(employeeId));
      
      if (!signature) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SIGNATURE_NOT_FOUND',
            message: 'Signature not found'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: signature
      });
    } catch (error) {
      logger.error(`Get signature by employee ID error: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SIGNATURE_FAILED',
          message: 'Failed to fetch signature'
        }
      });
    }
  }

  /**
   * Upload digital signature
   * POST /api/signatures
   */
  async uploadSignature(req, res) {
    try {
      const { employeeId, signatureTitle } = req.body;
      const file = req.file;
      
      if (!employeeId || !file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Employee ID and signature file are required'
          }
        });
      }

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only image files are allowed'
          }
        });
      }

      // Validate file size (500KB max)
      if (file.size > 500 * 1024) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size must not exceed 500KB'
          }
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const signature = await signatureService.uploadSignature(
        { employeeId: parseInt(employeeId), signatureTitle },
        file,
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(201).json({
        success: true,
        message: 'Signature uploaded successfully',
        data: signature
      });
    } catch (error) {
      logger.error(`Upload signature error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error.message
        }
      });
    }
  }

  /**
   * Delete digital signature
   * DELETE /api/signatures/:employeeId
   */
  async deleteSignature(req, res) {
    try {
      const { employeeId } = req.params;
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      await signatureService.deleteSignature(
        parseInt(employeeId),
        req.user.id,
        ipAddress,
        userAgent
      );
      
      return res.status(200).json({
        success: true,
        message: 'Signature deleted successfully'
      });
    } catch (error) {
      logger.error(`Delete signature error: ${error.message}`);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error.message
        }
      });
    }
  }
}

module.exports = new SignatureController();

