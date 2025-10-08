# Story 1.1: Project Setup & Development Environment

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.1  
**Story Type:** Technical Foundation  
**Priority:** Critical  
**Estimated Effort:** 4-6 hours  
**Dependencies:** None (First story)  
**Status:** Ready for Development

---

## User Story

As a **developer**,  
I want **a fully configured project repository with development environment setup**,  
so that **I can begin building features with proper tooling, version control, and deployment infrastructure in place**.

---

## Acceptance Criteria

1. ✅ Repository initialized with appropriate .gitignore for chosen technology stack
2. ✅ README.md includes project overview, setup instructions, and technology stack documentation
3. ✅ Package manager configuration file (package.json, requirements.txt, composer.json) with initial dependencies
4. ✅ Environment configuration system (.env.example file with all required variables documented)
5. ✅ Database connection configuration with environment-based settings
6. ✅ Development server runs successfully on localhost with hot-reload capability
7. ✅ Basic project structure created with folders for: routes/controllers, models, services, middleware, config, tests
8. ✅ Logging framework configured with appropriate log levels (debug, info, warn, error)
9. ✅ Error handling middleware captures and logs all unhandled errors
10. ✅ Health check endpoint (/api/health) returns 200 OK with system status

---

## Technical Specifications

### Technology Stack (from Architecture Document)

**Backend:**
- Node.js 18 LTS
- Express.js 4.18+
- PostgreSQL 14+
- Knex.js 2.5+ (Query Builder)

**Frontend:**
- Vue.js 3.3+ (Composition API)
- Vuetify 3.4+ (Component Library)
- Pinia (State Management)
- Axios (HTTP Client)

**Development Tools:**
- Git for version control
- npm for package management
- nodemon for hot-reload
- ESLint for code linting
- Prettier for code formatting

### Project Structure (Monorepo)

```
hrms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── logger.js
│   │   │   └── env.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── routes/
│   │   │   └── health.js
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── utils/
│   │   ├── jobs/
│   │   └── app.js
│   ├── migrations/
│   ├── seeds/
│   ├── tests/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── styles/
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── project-brief.md
│   ├── prd/
│   ├── architecture/
│   ├── ux/
│   └── stories/
├── storage/
│   ├── certificates/
│   ├── attachments/
│   └── logs/
├── .gitignore
├── README.md
└── docker-compose.yml (optional)
```

### Environment Variables (.env.example)

```bash
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_dev
DB_USER=hrms_user
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRY=8h

# File Storage
STORAGE_PATH=./storage

# Logging
LOG_LEVEL=debug
LOG_FILE=./storage/logs/app.log

# Email (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# System
PASSWORD_EXPIRY_DAYS=90
SESSION_TIMEOUT_MINUTES=480
MAX_FAILED_LOGIN_ATTEMPTS=5
```

### Health Check Endpoint

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-06T10:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

---

## Implementation Steps

### Backend Setup

1. **Initialize Node.js Project**
   ```bash
   mkdir hrms && cd hrms
   mkdir backend frontend docs storage
   cd backend
   npm init -y
   ```

2. **Install Dependencies**
   ```bash
   npm install express pg knex dotenv winston cors helmet
   npm install --save-dev nodemon eslint prettier
   ```

3. **Create .gitignore**
   ```
   node_modules/
   .env
   *.log
   storage/logs/
   storage/certificates/
   storage/attachments/
   .DS_Store
   ```

4. **Create package.json scripts**
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js",
     "lint": "eslint src/",
     "format": "prettier --write src/"
   }
   ```

5. **Create Logger Configuration (src/config/logger.js)**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'storage/logs/error.log', level: 'error' }),
       new winston.transports.File({ filename: 'storage/logs/app.log' }),
       new winston.transports.Console({
         format: winston.format.simple()
       })
     ]
   });
   
   module.exports = logger;
   ```

6. **Create Error Handler Middleware (src/middleware/errorHandler.js)**
   ```javascript
   const logger = require('../config/logger');
   
   module.exports = (err, req, res, next) => {
     logger.error({
       message: err.message,
       stack: err.stack,
       url: req.url,
       method: req.method
     });
     
     res.status(err.status || 500).json({
       success: false,
       error: {
         code: err.code || 'INTERNAL_ERROR',
         message: process.env.NODE_ENV === 'production' 
           ? 'An error occurred' 
           : err.message
       }
     });
   };
   ```

7. **Create Health Check Route (src/routes/health.js)**
   ```javascript
   const express = require('express');
   const router = express.Router();
   
   router.get('/health', (req, res) => {
     res.json({
       status: 'ok',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       database: 'connected', // Will check actual DB connection later
       version: '1.0.0'
     });
   });
   
   module.exports = router;
   ```

8. **Create Main App (src/app.js)**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const helmet = require('helmet');
   const logger = require('./config/logger');
   const errorHandler = require('./middleware/errorHandler');
   const healthRoutes = require('./routes/health');
   
   const app = express();
   
   // Middleware
   app.use(helmet());
   app.use(cors());
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   
   // Request logging
   app.use((req, res, next) => {
     logger.info(`${req.method} ${req.url}`);
     next();
   });
   
   // Routes
   app.use('/api', healthRoutes);
   
   // Error handler (must be last)
   app.use(errorHandler);
   
   module.exports = app;
   ```

9. **Create Server Entry Point (server.js)**
   ```javascript
   require('dotenv').config();
   const app = require('./src/app');
   const logger = require('./src/config/logger');
   
   const PORT = process.env.PORT || 3000;
   
   app.listen(PORT, () => {
     logger.info(`Server running on port ${PORT}`);
     logger.info(`Environment: ${process.env.NODE_ENV}`);
   });
   ```

### Frontend Setup

1. **Initialize Vue.js Project with Vite**
   ```bash
   cd ../frontend
   npm create vite@latest . -- --template vue
   npm install
   ```

2. **Install Vuetify and Dependencies**
   ```bash
   npm install vuetify@^3.4.0 @mdi/font
   npm install pinia axios
   ```

3. **Create .env.example**
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

### Documentation

1. **Create README.md** with:
   - Project overview
   - Technology stack
   - Setup instructions
   - Development workflow
   - Deployment guide

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] Health check endpoint returns 200 OK
- [ ] Environment variables load correctly
- [ ] Logger writes to console and file
- [ ] Error handler catches and logs errors
- [ ] Hot-reload works for both backend and frontend
- [ ] .gitignore excludes sensitive files
- [ ] README.md is complete and accurate

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows project style guide
- [ ] README.md documentation complete
- [ ] .env.example file documented
- [ ] Health check endpoint functional
- [ ] Development environment tested
- [ ] Committed to Git repository
- [ ] Ready for Story 1.2 (Database Schema)

---

## Notes for Developer

- This is the foundation story - take time to set it up correctly
- Follow the exact project structure specified
- Use the provided code examples as starting points
- Test the health check endpoint before marking complete
- Ensure hot-reload works for efficient development
- Document any deviations from the plan in commit messages

---

**Next Story:** 1.2 - Database Schema Foundation

