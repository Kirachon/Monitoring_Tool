# Navigation System Testing Guide

**Purpose:** Quick guide to test the newly implemented navigation system  
**Estimated Time:** 15-20 minutes  
**Status:** Ready for Testing

---

## Prerequisites

1. **Backend Running:** Ensure the backend server is running on `http://localhost:3000`
2. **Database:** PostgreSQL database is running and seeded with test data
3. **Test Users:** Have test credentials for different roles (Employee, Supervisor, HR Admin, System Admin)

---

## Quick Start

### 1. Start the Frontend Development Server

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

The application should start on `http://localhost:5173` (or next available port).

### 2. Open Browser

Navigate to: `http://localhost:5173`

You should be redirected to the login page.

---

## Test Scenarios

### Scenario 1: Basic Navigation (5 minutes)

**Objective:** Verify navigation drawer appears and all menu items work

**Steps:**
1. Login with any test user credentials
2. **Expected:** You should see:
   - Navigation drawer on the left side
   - App bar at the top with "Philippine Government HRMS" branding
   - User menu button in top-right corner
   - Dashboard content in the main area

3. Click each visible menu item:
   - Dashboard
   - Pass Slips
   - Leave
   - (Other items based on your permissions)

4. **Expected:** Each click should navigate to the corresponding page without errors

**✅ Pass Criteria:**
- Navigation drawer is visible
- All menu items are clickable
- Pages load without console errors
- URL changes correctly for each route

---

### Scenario 2: Permission-Based Visibility (5 minutes)

**Objective:** Verify menu items show/hide based on user permissions

**Test with Employee Role:**
1. Login as Employee
2. **Expected Visible Items:**
   - Dashboard
   - Pass Slips
   - Leave
3. **Expected Hidden Items:**
   - Approvals
   - Departments
   - Employees
   - Certificates
   - Reports
   - User Management
   - System Settings
   - Audit Logs

**Test with Supervisor Role:**
1. Login as Supervisor
2. **Expected Additional Items:**
   - Approvals (expandable group)
     - Pass Slips
     - Leave Requests

**Test with HR Administrator Role:**
1. Login as HR Admin
2. **Expected Additional Items:**
   - Departments
   - Employees
   - Certificates (expandable group)
     - Templates
     - Generate
     - Issuance Log
     - Digital Signatures
   - Reports

**Test with System Administrator Role:**
1. Login as System Admin
2. **Expected Additional Items:**
   - User Management
   - System Settings
   - Audit Logs

**✅ Pass Criteria:**
- Menu items appear/disappear based on user role
- No unauthorized menu items are visible
- Expandable groups work correctly

---

### Scenario 3: User Menu Functionality (3 minutes)

**Objective:** Verify user menu works correctly

**Steps:**
1. Click the user menu button in the top-right corner (shows your name)
2. **Expected:** Dropdown menu appears showing:
   - User avatar
   - Full name
   - Username
   - Role(s)
   - "My Profile" (disabled - future feature)
   - "Change Password"
   - "Logout"

3. Click "Change Password"
4. **Expected:** Navigate to change password page

5. Go back to dashboard, click user menu again
6. Click "Logout"
7. **Expected:** 
   - Logout successful
   - Redirected to login page
   - Navigation drawer no longer visible

**✅ Pass Criteria:**
- User menu displays correct information
- Change Password navigation works
- Logout works and redirects to login

---

### Scenario 4: Responsive Design (5 minutes)

**Objective:** Verify navigation works on different screen sizes

**Desktop (1920x1080):**
1. Open browser DevTools (F12)
2. Set viewport to 1920x1080
3. **Expected:**
   - Navigation drawer is expanded by default
   - All menu items show text and icons
   - App bar spans full width

**Tablet (768x1024):**
1. Set viewport to 768x1024
2. **Expected:**
   - Navigation drawer still visible
   - May be in rail mode (collapsed)
   - Click drawer to expand

**Mobile (375x667):**
1. Set viewport to 375x667
2. **Expected:**
   - Navigation drawer may be hidden by default
   - Hamburger menu icon appears (if implemented)
   - Content area uses full width

**Rail Mode Toggle:**
1. On desktop, click the chevron icon in the navigation drawer header
2. **Expected:**
   - Drawer collapses to rail mode (icons only)
   - Click again to expand
   - Click anywhere on rail to expand temporarily

**✅ Pass Criteria:**
- Layout adapts to different screen sizes
- Navigation remains accessible on all devices
- Rail mode toggle works correctly

---

### Scenario 5: Navigation State Persistence (2 minutes)

**Objective:** Verify navigation state persists across page refreshes

**Steps:**
1. Login and navigate to any page (e.g., Leave Management)
2. Refresh the page (F5)
3. **Expected:**
   - You remain logged in
   - Navigation drawer is still visible
   - You're still on the same page

4. Open a new tab and navigate to `http://localhost:5173`
5. **Expected:**
   - You're automatically logged in (if token is valid)
   - Navigation drawer appears
   - Redirected to dashboard

**✅ Pass Criteria:**
- Authentication persists across refreshes
- Navigation state is maintained
- No need to login again (unless token expired)

---

### Scenario 6: Error Handling (3 minutes)

**Objective:** Verify error boundary catches errors gracefully

**Steps:**
1. Login and navigate to dashboard
2. Open browser console (F12)
3. Manually trigger an error (if possible) or check console for any errors
4. **Expected:**
   - No console errors during normal navigation
   - If error occurs, error boundary should catch it
   - User-friendly error message displays
   - "Reload Page" button available

**✅ Pass Criteria:**
- No console errors during normal operation
- Error boundary catches component errors
- User can recover from errors

---

## Common Issues & Solutions

### Issue 1: Navigation Drawer Not Visible
**Symptoms:** After login, no navigation drawer appears

**Possible Causes:**
- MainLayout not rendering
- Router configuration issue
- Authentication state not set

**Solutions:**
1. Check browser console for errors
2. Verify you're logged in (check localStorage for 'token')
3. Verify route is wrapped with MainLayout in router config
4. Hard refresh (Ctrl+Shift+R)

---

### Issue 2: Menu Items Not Clickable
**Symptoms:** Clicking menu items does nothing

**Possible Causes:**
- Route paths don't match
- Permission check failing
- JavaScript error

**Solutions:**
1. Check browser console for errors
2. Verify route paths in router/index.js match NavigationDrawer.vue
3. Check user permissions in localStorage
4. Verify router is properly initialized

---

### Issue 3: Page Not Found (404)
**Symptoms:** Clicking menu item shows "Page not found" or blank page

**Possible Causes:**
- Route not defined
- Component import failing
- Path mismatch

**Solutions:**
1. Check router/index.js for route definition
2. Verify component file exists
3. Check component import path
4. Look for console errors

---

### Issue 4: Permission Denied
**Symptoms:** Menu item visible but clicking shows "Access Denied" or redirects to dashboard

**Possible Causes:**
- User doesn't have required permission
- Permission check in router guard failing

**Solutions:**
1. Check user's permissions in localStorage
2. Verify permission name matches route meta
3. Check router beforeEach guard logic

---

## Verification Checklist

Use this checklist to verify all functionality:

### Navigation Structure
- [ ] Navigation drawer appears on left side
- [ ] App bar appears at top with branding
- [ ] User menu button visible in top-right
- [ ] Footer appears at bottom (optional)

### Menu Items (based on role)
- [ ] Dashboard always visible
- [ ] Pass Slips visible (if has permission)
- [ ] Leave visible (if has permission)
- [ ] Approvals group visible (if supervisor+)
- [ ] Departments visible (if HR Admin+)
- [ ] Employees visible (if HR Admin+)
- [ ] Certificates group visible (if HR Admin+)
- [ ] Reports visible (if HR Admin+)
- [ ] User Management visible (if System Admin)
- [ ] System Settings visible (if System Admin)
- [ ] Audit Logs visible (if System Admin)

### Navigation Functionality
- [ ] All visible menu items are clickable
- [ ] Clicking menu item navigates to correct page
- [ ] URL updates correctly
- [ ] Page content loads without errors
- [ ] Back/forward browser buttons work

### User Menu
- [ ] User menu displays correct user info
- [ ] Avatar displays correctly
- [ ] Change Password link works
- [ ] Logout works and redirects to login

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Rail mode toggle works
- [ ] Drawer expands/collapses correctly

### State Persistence
- [ ] Authentication persists across refreshes
- [ ] Navigation state maintained
- [ ] No need to re-login (unless token expired)

### Error Handling
- [ ] No console errors during normal operation
- [ ] Error boundary catches errors
- [ ] User-friendly error messages
- [ ] Can recover from errors

---

## Reporting Issues

If you encounter any issues during testing, please report them with:

1. **Issue Description:** What went wrong?
2. **Steps to Reproduce:** How can we reproduce the issue?
3. **Expected Behavior:** What should have happened?
4. **Actual Behavior:** What actually happened?
5. **User Role:** What role were you logged in as?
6. **Browser:** What browser and version?
7. **Console Errors:** Any errors in browser console?
8. **Screenshots:** If applicable

---

## Success Criteria

**Navigation system is considered functional if:**

✅ All test scenarios pass  
✅ No critical console errors  
✅ Navigation works for all user roles  
✅ Responsive design works on all screen sizes  
✅ User menu functions correctly  
✅ State persists across refreshes  
✅ Error handling works gracefully  

---

## Next Steps After Testing

Once navigation testing is complete and all issues are resolved:

1. **Phase 1 Complete:** Navigation system is functional ✅
2. **Phase 2 Begin:** Create comprehensive UI/UX enhancement PRD
3. **Design System:** Implement design tokens, typography, spacing
4. **Component Library:** Build reusable components
5. **Layout Standardization:** Apply consistent layouts across all views

---

**Happy Testing! 🚀**

