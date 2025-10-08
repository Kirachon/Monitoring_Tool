# Philippine Government HRMS - Production Deployment Checklist

## Overview
This checklist guides you through deploying the HRMS application to production using Vercel (frontend), Render (backend), and Render PostgreSQL (database).

---

## A. Pre-Deployment Verification

### 1. Git Repository Status ✅
- [x] Git initialized in `d:/GitProjects/Monitoring_Tool`
- [x] `.gitignore` properly configured
- [x] All deployment files staged for commit
- [x] All bug fixes and features included

### 2. Files Staged for Commit
The following files are ready to be committed:

**Deployment Configuration:**
- [x] `.gitignore` - Updated with comprehensive exclusions
- [x] `vercel.json` - Vercel deployment configuration
- [x] `render.yaml` - Render deployment configuration with Puppeteer support
- [x] `DEPLOYMENT.md` - Comprehensive deployment guide
- [x] `backend/render-build.sh` - Build script for Chromium installation

**Environment Templates:**
- [x] `backend/.env.example` - Backend environment variables template
- [x] `frontend/.env.example` - Frontend environment variables template

**Bug Fixes (All 5 Issues):**
- [x] `backend/src/services/reportService.js` - Fixed employee reports column error
- [x] `backend/src/services/employeeService.js` - Added getEmployeeByEmployeeId method
- [x] `frontend/src/views/Profile.vue` - New My Profile page
- [x] `frontend/src/views/LeaveApprovals.vue` - Disabled actions for past dates
- [x] `frontend/src/views/LeaveList.vue` - Disabled actions for past dates
- [x] `frontend/src/views/CertificateRequest.vue` - New certificate request page
- [x] `backend/migrations/20250108_add_certificate_requests.js` - Certificate requests table
- [x] `backend/src/controllers/certificateController.js` - Certificate request endpoints
- [x] `backend/src/services/certificateService.js` - Certificate request service methods
- [x] `backend/src/routes/certificates.js` - Certificate request routes

**CORS and Configuration:**
- [x] `backend/src/app.js` - Updated CORS to support multiple origins

**Complete Application:**
- [x] All backend files (controllers, services, routes, middleware, config)
- [x] All frontend files (components, views, services, store, styles)
- [x] All database migrations (20 migrations)
- [x] All database seeds
- [x] All documentation files
- [x] Docker configuration
- [x] Package.json files for both frontend and backend

### 3. Sensitive Files Properly Excluded ✅
The following are correctly excluded from Git:
- [x] `node_modules/` directories
- [x] `.env` files (local environment variables)
- [x] `dist/` and `build/` directories
- [x] `logs/` directories
- [x] `test-results/` and `playwright-report/`
- [x] IDE configuration files (`.vscode/`, `.idea/`)
- [x] Temporary files (`*.tmp`, `.cache/`, `temp_login.json`)

### 4. Database Migration Status ✅
**All 20 migrations completed:**
1. ✅ 20250106000001_create_roles_permissions.js
2. ✅ 20250106000002_create_departments.js
3. ✅ 20250106000003_create_employees.js
4. ✅ 20250106000004_create_users.js
5. ✅ 20250106000005_create_pass_slips.js
6. ✅ 20250106000006_create_leave_types.js
7. ✅ 20250106000007_create_leave_requests.js
8. ✅ 20250106000008_create_leave_balances.js
9. ✅ 20250106000009_create_leave_monetization.js
10. ✅ 20250106000010_create_certificates.js
11. ✅ 20250106000011_create_approval_workflows.js
12. ✅ 20250106000012_create_holidays.js
13. ✅ 20250106000013_create_system_config.js
14. ✅ 20250106000014_create_audit_logs.js
15. ✅ 20250106000015_add_foreign_keys.js
16. ✅ 20250106000016_create_password_history.js
17. ✅ 20250106000012_create_leave_monetizations.js
18. ✅ 20251007120000_add_performance_indexes.js
19. ✅ 20251007130000_add_denial_reason_to_leave_requests.js
20. ✅ **20250108_add_certificate_requests.js** (NEW - for certificate request feature)

---

## B. Environment Variables for Vercel (Frontend)

### Required Variables:
```bash
VITE_API_URL=https://your-backend-name.onrender.com
```

**Instructions:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the variable above
3. **Important:** Replace `your-backend-name` with your actual Render backend service name
4. This will be available after you deploy the backend to Render

### Optional Variables:
```bash
VITE_APP_NAME=Philippine Government HRMS
VITE_APP_VERSION=1.0.0
```

---

## C. Environment Variables for Render (Backend)

### Required Variables:

#### 1. NODE_ENV (Auto-configured in render.yaml)
```bash
NODE_ENV=production
```
**Status:** ✅ Already set in render.yaml

#### 2. DATABASE_URL (Manual - CRITICAL)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```
**Instructions:**
1. Create Render PostgreSQL database first (see Section D)
2. Copy the "Internal Database URL" from Render PostgreSQL dashboard
3. Add this as an environment variable in your Render Web Service
4. **Format:** `postgresql://username:password@hostname:5432/database_name`

#### 3. JWT_SECRET (Auto-generated in render.yaml)
```bash
JWT_SECRET=<auto-generated-by-render>
```
**Status:** ✅ Render will auto-generate a secure random string

#### 4. JWT_EXPIRY (Auto-configured in render.yaml)
```bash
JWT_EXPIRY=8h
```
**Status:** ✅ Already set in render.yaml

#### 5. PORT (Auto-configured in render.yaml)
```bash
PORT=3000
```
**Status:** ✅ Already set in render.yaml

#### 6. FRONTEND_URL (Manual - CRITICAL for CORS)
```bash
FRONTEND_URL=https://your-project-name.vercel.app
```
**Instructions:**
1. Deploy frontend to Vercel first
2. Copy the Vercel deployment URL
3. Add this as an environment variable in Render
4. **Important:** This enables CORS for your frontend

### Puppeteer Configuration (Auto-configured in render.yaml):

#### 7. PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
```
**Status:** ✅ Already set in render.yaml

#### 8. PUPPETEER_EXECUTABLE_PATH
```bash
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```
**Status:** ✅ Already set in render.yaml
**Note:** The `render-build.sh` script will install Chromium at this path

### Summary of Manual Environment Variables:
- [ ] `DATABASE_URL` - Get from Render PostgreSQL dashboard
- [ ] `FRONTEND_URL` - Get from Vercel deployment

---

## D. Database Setup Steps

### 1. Create Render PostgreSQL Database

```bash
# Via Render Dashboard:
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: hrms-database (or your preferred name)
   - Database: hrms_db
   - User: hrms_user
   - Region: Singapore (or closest to your users)
   - Plan: Starter ($7/month) or Free
4. Click "Create Database"
5. Wait 2-3 minutes for provisioning
```

### 2. Get Database Connection String

```bash
# In Render PostgreSQL Dashboard:
1. Go to your database
2. Scroll to "Connections" section
3. Copy "Internal Database URL"
4. Format: postgresql://hrms_user:password@dpg-xxx.render.com/hrms_db
5. Save this for backend environment variables
```

### 3. Run Migrations on Production Database

```bash
# On your local machine:
cd backend

# Set the production database URL temporarily
export DATABASE_URL="postgresql://hrms_user:password@dpg-xxx.render.com/hrms_db"

# Run all migrations
npx knex migrate:latest

# Expected output:
# Batch 1 run: 20 migrations
```

### 4. Run Seeds (Production Data)

```bash
# Still in backend directory with DATABASE_URL set:
npx knex seed:run

# This will create:
# - Roles and permissions
# - Test users (admin, hradmin, supervisor, employee)
# - Leave types
# - Holidays
# - System configuration
# - Certificate templates
```

**⚠️ IMPORTANT:** After deployment, change the default passwords for all test users!

---

## E. Deployment Steps

### Step 1: Commit and Push to GitHub

```bash
# In project root (d:/GitProjects/Monitoring_Tool):

# Create commit with all changes
git commit -m "Prepare for production deployment

## Bug Fixes (5/5 Complete)
- Fix employee reports database column error (position_title → position)
- Verify certificate editing functionality (all code correct)
- Create My Profile page for employees
- Disable leave action buttons for past dates
- Implement certificate request feature for employees

## New Features
- Certificate request system with database table and full CRUD
- My Profile page showing employee information
- Past date validation for leave approvals and cancellations

## Deployment Configuration
- Add vercel.json for Vercel deployment
- Add render.yaml for Render deployment with Puppeteer support
- Add render-build.sh for Chromium installation
- Update CORS configuration to support multiple origins
- Update .gitignore with comprehensive exclusions
- Add environment variable templates

## Database
- Add certificate_requests table migration
- All 20 migrations ready for production

## Documentation
- Add DEPLOYMENT.md comprehensive guide
- Add BUG-FIXES-SUMMARY.md
- Add CERTIFICATE-REQUEST-404-FIX.md
- Add PRODUCTION-DEPLOYMENT-CHECKLIST.md"

# Push to GitHub
git push origin main
```

### Step 2: Deploy Backend to Render

```bash
# Via Render Dashboard:
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect render.yaml
5. Review configuration:
   - Name: hrms-backend
   - Environment: Node
   - Region: Singapore
   - Build Command: cd backend && chmod +x render-build.sh && ./render-build.sh
   - Start Command: cd backend && npm start
6. Add environment variables:
   - DATABASE_URL: <from-postgresql-dashboard>
   - FRONTEND_URL: <will-add-after-vercel-deployment>
7. Click "Create Web Service"
8. Wait 10-15 minutes for first deployment (Chromium installation takes time)
9. Note your backend URL: https://hrms-backend.onrender.com
```

### Step 3: Deploy Frontend to Vercel

```bash
# Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variable:
   - VITE_API_URL: https://hrms-backend.onrender.com
6. Click "Deploy"
7. Wait 3-5 minutes for deployment
8. Note your frontend URL: https://your-project.vercel.app
```

### Step 4: Update Backend FRONTEND_URL

```bash
# In Render Dashboard:
1. Go to your backend web service
2. Go to "Environment" tab
3. Add or update:
   - FRONTEND_URL: https://your-project.vercel.app
4. Click "Save Changes"
5. Render will automatically redeploy (2-3 minutes)
```

---

## F. Post-Deployment Verification

### 1. Backend Health Check

```bash
# Test backend is running:
curl https://hrms-backend.onrender.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-10-08T...",
  "uptime": <number>,
  "database": "connected",
  "version": "1.0.0",
  "environment": "production"
}
```

**✅ Success Criteria:**
- [ ] Status is "ok"
- [ ] Database is "connected"
- [ ] Environment is "production"

### 2. Frontend Accessibility

```bash
# Open in browser:
https://your-project.vercel.app

# Expected:
- Login page loads
- No console errors
- Vuetify styles applied correctly
```

**✅ Success Criteria:**
- [ ] Page loads without errors
- [ ] Login form is visible
- [ ] No 404 errors in browser console

### 3. Authentication Test

**Test Credentials:**
```
Admin:
  Username: admin
  Password: Admin123!

HR Admin:
  Username: hradmin
  Password: HRAdmin123!

Supervisor:
  Username: supervisor
  Password: Supervisor123!

Employee:
  Username: employee
  Password: Employee123!
```

**Test Steps:**
1. [ ] Log in as Admin
2. [ ] Verify dashboard loads
3. [ ] Check navigation menu shows all admin items
4. [ ] Log out
5. [ ] Log in as Employee
6. [ ] Verify dashboard loads
7. [ ] Check navigation menu shows only employee items

### 4. Bug Fixes Verification

**Issue 1: Employee Reports**
- [ ] Log in as HR Admin or System Admin
- [ ] Navigate to Reports → Employee Reports
- [ ] Click "Generate Report"
- [ ] Verify report generates without "column e.position_title does not exist" error
- [ ] Verify "Position" column displays correctly

**Issue 2: Certificate Editing**
- [ ] Log in as HR Admin or System Admin
- [ ] Navigate to Certificates → Templates
- [ ] Click edit icon on any template
- [ ] Verify edit dialog opens
- [ ] Make a change and save
- [ ] Verify changes are saved

**Issue 3: My Profile Page**
- [ ] Log in as any user
- [ ] Click user menu (top right)
- [ ] Click "My Profile"
- [ ] Verify profile page loads
- [ ] Verify personal, employment, and contact information displays

**Issue 4: Past Date Actions**
- [ ] Log in as Supervisor
- [ ] Navigate to Approvals → Leave Approvals
- [ ] Find a leave request with past start date
- [ ] Verify Approve/Deny buttons are disabled
- [ ] Hover over disabled buttons to see tooltip: "Cannot modify past leave requests"

**Issue 5: Certificate Request Feature**
- [ ] Log in as Employee
- [ ] Verify "Request Certificate" appears in navigation menu
- [ ] Click "Request Certificate"
- [ ] Verify page loads without 404 errors
- [ ] Fill out certificate request form
- [ ] Submit request
- [ ] Verify request appears in history table

### 5. CORS Verification

```bash
# Open browser console on frontend:
# Should see no CORS errors when making API calls

# If you see CORS errors:
1. Check FRONTEND_URL is set correctly in Render
2. Verify backend redeployed after setting FRONTEND_URL
3. Check backend logs for CORS-related errors
```

### 6. Puppeteer/Certificate Generation Test

- [ ] Log in as HR Admin or System Admin
- [ ] Navigate to Certificates → Generate Certificate
- [ ] Select an employee and template
- [ ] Click "Generate Certificate"
- [ ] Verify PDF generates successfully
- [ ] Download and open PDF
- [ ] Verify content is correct

**If certificate generation fails:**
1. Check Render logs for Puppeteer errors
2. Verify Chromium was installed (check build logs)
3. Verify PUPPETEER_EXECUTABLE_PATH is set correctly

---

## G. Important Notes and Warnings

### ⚠️ Critical Security Actions

**IMMEDIATELY after deployment:**
1. [ ] Change all default test user passwords
2. [ ] Review and update JWT_SECRET if needed
3. [ ] Enable 2FA for admin accounts (if implemented)
4. [ ] Review audit logs regularly

### ⚠️ Render Free Tier Limitations

If using Render Free tier:
- Backend will spin down after 15 minutes of inactivity
- First request after spin-down will take 30-60 seconds
- Database has 90-day expiration
- **Recommendation:** Use Starter plan ($7/month) for production

### ⚠️ Vercel Limitations

- Hobby plan has bandwidth limits
- Serverless functions have 10-second timeout
- **Recommendation:** Upgrade to Pro plan ($20/month) for production

### ⚠️ Database Backups

Render PostgreSQL:
- Starter plan includes daily backups (7-day retention)
- Free plan has NO backups
- **Recommendation:** Use Starter plan and enable backups

### ⚠️ Monitoring and Logging

**Set up monitoring:**
1. [ ] Enable Vercel Analytics
2. [ ] Enable Render metrics and alerts
3. [ ] Set up error tracking (e.g., Sentry)
4. [ ] Configure log retention policies

---

## H. Troubleshooting Common Issues

### Issue: Backend deployment fails

**Check:**
1. Build logs in Render dashboard
2. Verify render-build.sh has execute permissions
3. Check if Chromium installation succeeded
4. Verify all dependencies in package.json

**Solution:**
```bash
# If build fails, try manual build locally:
cd backend
chmod +x render-build.sh
./render-build.sh
```

### Issue: Frontend shows blank page

**Check:**
1. Browser console for errors
2. Verify VITE_API_URL is set correctly
3. Check if backend is accessible
4. Verify Vite build completed successfully

**Solution:**
```bash
# Test build locally:
cd frontend
npm run build
npm run preview
```

### Issue: Database connection fails

**Check:**
1. DATABASE_URL format is correct
2. Database is running in Render
3. Firewall rules allow connections
4. Migrations ran successfully

**Solution:**
```bash
# Test connection locally:
export DATABASE_URL="your-production-url"
cd backend
npx knex migrate:status
```

### Issue: CORS errors in browser

**Check:**
1. FRONTEND_URL is set in Render backend
2. Backend redeployed after setting FRONTEND_URL
3. URL matches exactly (no trailing slash)

**Solution:**
```bash
# In Render backend environment:
FRONTEND_URL=https://your-project.vercel.app
# (no trailing slash)
```

### Issue: Certificate generation fails

**Check:**
1. Chromium installed successfully (check build logs)
2. PUPPETEER_EXECUTABLE_PATH is correct
3. Render has enough memory (upgrade plan if needed)

**Solution:**
```bash
# Check Render logs for Puppeteer errors
# May need to upgrade to higher plan for more memory
```

---

## I. Estimated Costs

### Development/Testing (Free Tier):
- Vercel: $0/month (Hobby plan)
- Render Web Service: $0/month (Free tier with limitations)
- Render PostgreSQL: $0/month (Free tier, 90-day limit)
- **Total: $0/month**

### Production (Recommended):
- Vercel: $20/month (Pro plan)
- Render Web Service: $7/month (Starter plan)
- Render PostgreSQL: $7/month (Starter plan with backups)
- **Total: $34/month**

### Enterprise:
- Custom pricing based on usage
- Dedicated support
- SLA guarantees
- Advanced security features

---

## J. Next Steps After Deployment

1. [ ] Test all features thoroughly in production
2. [ ] Change all default passwords
3. [ ] Set up monitoring and alerts
4. [ ] Configure backup schedules
5. [ ] Document production URLs and credentials (securely)
6. [ ] Train users on the system
7. [ ] Set up support channels
8. [ ] Plan for regular maintenance windows

---

## K. Support and Resources

**Documentation:**
- `DEPLOYMENT.md` - Detailed deployment guide
- `docs/BUG-FIXES-SUMMARY.md` - All bug fixes documented
- `docs/CERTIFICATE-REQUEST-404-FIX.md` - Certificate request troubleshooting
- `docs/API_REFERENCE.md` - API documentation
- `docs/DEVELOPER_GUIDE.md` - Development guide

**Useful Links:**
- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- GitHub Repository: https://github.com/Kirachon/Monitoring_Tool

**Test Endpoints:**
- Backend Health: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-project.vercel.app`

---

## ✅ Final Checklist

Before going live:
- [ ] All files committed and pushed to GitHub
- [ ] Database created and migrations run
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] All 5 bug fixes verified in production
- [ ] Test users can log in
- [ ] Certificate generation works
- [ ] Default passwords changed
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Documentation updated with production URLs

**Deployment is complete when all checkboxes above are checked!** ✅

