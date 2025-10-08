# Philippine Government HRMS - Deployment Guide

## Overview
This guide covers deploying the HRMS application to production using:
- **Frontend**: Vercel (Vue 3 + Vuetify)
- **Backend**: Render Web Service (Node.js + Express + Puppeteer)
- **Database**: Supabase PostgreSQL or Render PostgreSQL

---

## Prerequisites

1. **GitHub Account** - Repository must be pushed to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com
4. **Database** - Either:
   - Supabase account (https://supabase.com) OR
   - Render PostgreSQL database

---

## Step 1: Prepare the Repository

### 1.1 Initialize Git (if not already done)
```bash
cd d:/GitProjects/Monitoring_Tool
git init
git add .
git commit -m "Initial commit: Philippine Government HRMS"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `Monitoring_Tool` (or your preferred name)
3. Do NOT initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Monitoring_Tool.git
git push -u origin main
```

---

## Step 2: Set Up Database

### Option A: Using Supabase (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose organization and set project name
   - Set a strong database password
   - Select region (closest to your users)

2. **Get Connection Details**
   - Go to Project Settings > Database
   - Copy the "Connection string" (URI format)
   - Example: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

3. **Run Migrations**
   ```bash
   cd backend
   # Set DATABASE_URL temporarily
   export DATABASE_URL="your-supabase-connection-string"
   npx knex migrate:latest
   npx knex seed:run
   ```

### Option B: Using Render PostgreSQL

1. **Create Database on Render**
   - Go to Render Dashboard
   - Click "New +" > "PostgreSQL"
   - Choose name and region
   - Select plan (Free tier available)
   - Click "Create Database"

2. **Get Connection Details**
   - Copy "Internal Database URL" from database dashboard
   - Example: `postgresql://user:pass@dpg-xxx.render.com/dbname`

3. **Run Migrations**
   ```bash
   cd backend
   export DATABASE_URL="your-render-database-url"
   npx knex migrate:latest
   npx knex seed:run
   ```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to Render Dashboard
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hrms-backend`
   - **Region**: Singapore (or closest to users)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (render.yaml will handle this)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Starter (or Free)

### 3.2 Set Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-database-connection-string>
JWT_SECRET=<generate-a-strong-random-string>
JWT_EXPIRY=8h
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Important**: For Puppeteer to work on Render, you need to add a build script to install Chromium:

Create `backend/render-build.sh`:
```bash
#!/bin/bash
npm install
apt-get update && apt-get install -y chromium
```

Then update render.yaml:
```yaml
buildCommand: cd backend && chmod +x render-build.sh && ./render-build.sh
```

### 3.3 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note your backend URL: `https://hrms-backend.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Import Project

1. Go to Vercel Dashboard
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Set Environment Variables

Add these environment variables in Vercel dashboard:

```
VITE_API_URL=https://hrms-backend.onrender.com
```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Note your frontend URL: `https://your-project.vercel.app`

---

## Step 5: Configure CORS

Update `backend/src/config/cors.js` to allow your Vercel domain:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-project.vercel.app'  // Add your Vercel URL
];
```

Commit and push this change to trigger a new deployment on Render.

---

## Step 6: Test Production Deployment

### 6.1 Test Backend
```bash
curl https://hrms-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

### 6.2 Test Frontend
1. Open `https://your-project.vercel.app`
2. Try logging in with test credentials:
   - Admin: `admin / Admin123!`
   - HR Admin: `hradmin / HRAdmin123!`
   - Supervisor: `supervisor / Supervisor123!`
   - Employee: `employee / Employee123!`

### 6.3 Test Full Flow
1. Log in as Employee
2. Create a pass slip request
3. Log out and log in as Supervisor
4. Approve the pass slip
5. Verify the approval appears in reports

---

## Step 7: Post-Deployment Configuration

### 7.1 Set Up Custom Domain (Optional)

**For Vercel (Frontend)**:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**For Render (Backend)**:
1. Go to Service Settings > Custom Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 7.2 Enable HTTPS
Both Vercel and Render provide automatic HTTPS certificates. No additional configuration needed.

### 7.3 Set Up Monitoring
- Enable Vercel Analytics in project settings
- Enable Render metrics and alerts in service settings

---

## Troubleshooting

### Backend Issues

**Problem**: Puppeteer fails to generate certificates
**Solution**: Ensure Chromium is installed in render-build.sh

**Problem**: Database connection fails
**Solution**: Check DATABASE_URL format and firewall rules

**Problem**: JWT authentication fails
**Solution**: Verify JWT_SECRET is set and consistent

### Frontend Issues

**Problem**: API calls fail with CORS errors
**Solution**: Add Vercel URL to CORS allowedOrigins

**Problem**: Environment variables not working
**Solution**: Ensure variables start with `VITE_` prefix

**Problem**: Build fails
**Solution**: Check Node.js version compatibility (use Node 18+)

---

## Maintenance

### Updating the Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel and Render will auto-deploy

### Database Migrations

```bash
# Connect to production database
export DATABASE_URL="your-production-database-url"

# Run new migrations
cd backend
npx knex migrate:latest
```

### Monitoring Logs

**Render Logs**:
- Go to Service > Logs tab
- View real-time logs

**Vercel Logs**:
- Go to Project > Deployments
- Click on deployment > View Function Logs

---

## Security Checklist

- [ ] Strong JWT_SECRET generated
- [ ] Database password is strong and secure
- [ ] CORS configured with specific origins (not *)
- [ ] Environment variables set correctly
- [ ] HTTPS enabled on both frontend and backend
- [ ] Database backups configured
- [ ] Rate limiting enabled (if applicable)
- [ ] Audit logs reviewed regularly

---

## Support

For issues or questions:
1. Check logs in Render and Vercel dashboards
2. Review this deployment guide
3. Check application documentation in `/docs`
4. Contact system administrator

---

## Estimated Costs

**Free Tier (Development/Testing)**:
- Vercel: Free (Hobby plan)
- Render: Free (Web Service + PostgreSQL)
- Total: $0/month

**Production (Recommended)**:
- Vercel: $20/month (Pro plan)
- Render: $7/month (Starter Web Service) + $7/month (Starter PostgreSQL)
- Total: $34/month

**Enterprise**:
- Custom pricing based on usage and requirements

