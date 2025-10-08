const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const employeeRoutes = require('./routes/employees');
const holidayRoutes = require('./routes/holidays');
const passSlipRoutes = require('./routes/passSlips');
const leaveRoutes = require('./routes/leave');
const leaveTypeRoutes = require('./routes/leaveTypes');
const leaveCreditRoutes = require('./routes/leaveCredits');
const certificateRoutes = require('./routes/certificates');
const signatureRoutes = require('./routes/signatures');
const dashboardRoutes = require('./routes/dashboard');
const workflowRoutes = require('./routes/workflows');
const leaveMonetizationRoutes = require('./routes/leaveMonetization');
const reportRoutes = require('./routes/reports');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/signatures', express.static('signatures'));
app.use('/certificates', express.static('certificates'));

// Request logging middleware
app.use(requestLogger);

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/pass-slips', passSlipRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/leave-types', leaveTypeRoutes);
app.use('/api/leave-credits', leaveCreditRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/signatures', signatureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/leave-monetization', leaveMonetizationRoutes);
app.use('/api/reports', reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Philippine Government HRMS API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/docs'
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

