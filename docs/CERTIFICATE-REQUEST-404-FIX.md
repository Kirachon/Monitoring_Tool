# Certificate Request 404 Error - Fix Guide

## Problem
When employees attempt to request certificates, the frontend receives a **404 Not Found** error for the endpoint `GET /api/certificates/my-requests`.

## Root Cause
The backend server was running before the new certificate request routes were added. Node.js/Express does not hot-reload routes, so the server must be restarted to pick up the new endpoints.

## Solution

### Step 1: Restart the Backend Server

**Option A: If running with npm/node directly**
1. Find the backend process:
   ```bash
   # Windows
   tasklist | findstr node
   
   # Linux/Mac
   ps aux | grep node
   ```

2. Kill the process:
   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /F /PID <PID>
   
   # Linux/Mac
   kill <PID>
   ```

3. Restart the backend:
   ```bash
   cd backend
   npm start
   # OR for development with auto-reload
   npm run dev
   ```

**Option B: If running with nodemon**
- Nodemon should auto-restart, but if not:
  ```bash
  # Stop with Ctrl+C
  # Then restart
  cd backend
  npm run dev
  ```

**Option C: If running with Docker**
```bash
docker-compose restart backend
# OR
docker restart <backend-container-name>
```

**Option D: If running with PM2**
```bash
pm2 restart hrms-backend
# OR
pm2 restart all
```

### Step 2: Verify Backend is Running

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-08T...",
  "uptime": <small number>,
  "database": "connected",
  "version": "1.0.0",
  "environment": "development"
}
```

**Important**: Check the `uptime` value. If it's a large number (e.g., 45000+ seconds), the server hasn't been restarted and won't have the new routes.

### Step 3: Test the Certificate Request Endpoints

Run the automated test script:
```bash
cd backend
node test-certificate-endpoint.js
```

Expected output:
```
============================================================
Testing Certificate Request Endpoints
============================================================

1. Logging in as employee...
✓ Login successful
  Token: eyJhbGciOiJIUzI1NiIs...

2. Testing GET /api/certificates/my-requests...
✓ GET /api/certificates/my-requests successful
  Status: 200
  Requests found: 0

3. Testing POST /api/certificates/request...
✓ POST /api/certificates/request successful
  Status: 201
  Request ID: 1
  Certificate Type: Certificate of Employment
  Status: Pending

4. Verifying request was created...
✓ Verification successful
  Total requests: 1

============================================================
✓ All tests passed!
============================================================
```

### Step 4: Test in Frontend

1. Open the application: `http://localhost:5173`
2. Log in as employee: `employee / Employee123!`
3. Navigate to "Request Certificate" in the menu
4. Verify:
   - Page loads without errors
   - Request history table displays (may be empty)
   - Form is visible and functional
5. Submit a test certificate request
6. Verify the request appears in the history table

## Verification Checklist

- [ ] Backend server restarted successfully
- [ ] Health check shows low uptime (< 60 seconds)
- [ ] Automated test script passes all tests
- [ ] Frontend certificate request page loads without 404 errors
- [ ] Certificate request form is visible
- [ ] Request history table displays
- [ ] Can submit a certificate request
- [ ] Submitted request appears in history table

## Troubleshooting

### Issue: Still getting 404 after restart

**Check 1: Verify routes are registered**
```bash
cd backend
grep -n "my-requests" src/routes/certificates.js
```
Should show line 66 with the route definition.

**Check 2: Verify controller method exists**
```bash
grep -n "getMyCertificateRequests" src/controllers/certificateController.js
```
Should show the method definition.

**Check 3: Verify service method exists**
```bash
grep -n "getMyCertificateRequests" src/services/certificateService.js
```
Should show the method definition.

**Check 4: Check backend logs**
Look for any errors during startup:
```bash
# If using npm start
# Check the terminal where backend is running

# If using PM2
pm2 logs hrms-backend

# If using Docker
docker logs <backend-container-name>
```

### Issue: 401 Unauthorized

**Cause**: Authentication token is missing or invalid

**Solution**:
1. Verify you're logged in
2. Check browser console for token in localStorage
3. Try logging out and logging back in

### Issue: 403 Forbidden

**Cause**: User lacks `certificate.request` permission

**Solution**:
1. Verify employee role has the permission:
   ```bash
   docker exec hrms_postgres psql -U hrms_user -d hrms_db -c "SELECT r.name as role, p.name as permission FROM roles r JOIN role_permissions rp ON r.id = rp.role_id JOIN permissions p ON rp.permission_id = p.id WHERE r.name = 'Employee' AND p.name = 'certificate.request';"
   ```

2. If permission is missing, run seeds:
   ```bash
   cd backend
   npx knex seed:run
   ```

### Issue: 500 Internal Server Error

**Cause**: Database table missing or service error

**Solution**:
1. Verify certificate_requests table exists:
   ```bash
   docker exec hrms_postgres psql -U hrms_user -d hrms_db -c "\d certificate_requests"
   ```

2. If table is missing, run migration:
   ```bash
   cd backend
   npx knex migrate:latest
   ```

3. Check backend logs for specific error message

## Additional Notes

### Route Order Matters
The new routes were added BEFORE the `/preview` route to avoid conflicts with dynamic routes. The order in `certificates.js` is:
1. `/request` (POST)
2. `/my-requests` (GET)
3. `/preview` (POST)
4. `/generate` (POST)
5. `/:id/download` (GET) - dynamic route last

### Database Migration
The `certificate_requests` table was created with migration `20250108_add_certificate_requests.js`. If you encounter database errors, verify this migration ran successfully:
```bash
cd backend
npx knex migrate:status
```

### Frontend Service
The frontend service (`frontend/src/services/certificateService.js`) has two new methods:
- `requestCertificate(data)` - POST to `/api/certificates/request`
- `getMyCertificateRequests()` - GET from `/api/certificates/my-requests`

## Summary

The 404 error occurs because the backend server needs to be restarted to load the new routes. After restarting:
1. The `/api/certificates/my-requests` endpoint will be available
2. The `/api/certificates/request` endpoint will be available
3. Employees can request certificates through the frontend
4. Certificate request history will display correctly

**Key Point**: Always restart the backend server after adding new routes or modifying route files.

