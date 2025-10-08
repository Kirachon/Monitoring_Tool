const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../config/logger');

/**
 * Health check endpoint
 * GET /api/health
 * Returns system status and database connectivity
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    let databaseStatus = 'disconnected';
    try {
      await db.raw('SELECT 1');
      databaseStatus = 'connected';
    } catch (dbError) {
      logger.error('Database health check failed:', dbError.message);
      databaseStatus = 'disconnected';
    }

    // Prepare health response
    const healthResponse = {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: databaseStatus,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Return 200 if healthy, 503 if degraded
    const statusCode = healthResponse.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthResponse);
  } catch (error) {
    logger.error('Health check error:', error.message);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    });
  }
});

module.exports = router;

