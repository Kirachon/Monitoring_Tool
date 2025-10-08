import { test, expect } from '@playwright/test';

// Helper to login with keyboard typing (more reliable with Vue v-model)
async function login(page, { username, password }) {
  await page.goto('/login');
  await expect(page.getByLabel('Username')).toBeVisible();

  await page.getByLabel('Username').click();
  await page.keyboard.type(username);

  await page.getByRole('textbox', { name: 'Password Password' }).click();
  await page.keyboard.type(password);

  await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 3000 });
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
}

const creds = {
  admin: { username: 'admin', password: 'Admin123!' },
  hr: { username: 'hradmin', password: 'HRAdmin123!' },
  supervisor: { username: 'supervisor', password: 'Supervisor123!' },
  employee: { username: 'employee', password: 'Employee123!' }
};

// ---------------------------- Admin Dashboard ----------------------------

test.describe('Dashboard (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, creds.admin);
  });

  test('should load dashboard with header and welcome message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Welcome, System Administrator\./i)).toBeVisible();
  });

  test('should show admin action cards and charts', async ({ page }) => {
    // Action cards
    await expect(page.getByRole('button', { name: 'User Management - Manage users and roles' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Audit Logs - View system activities' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'System Settings - Configure system' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analytics - Key system metrics' })).toBeVisible();

    // Chart titles
    await expect(page.getByText('Requests — Last 7 Days')).toBeVisible();
    await expect(page.getByText('Requests by Type')).toBeVisible();
  });

  test('quick actions navigate to the correct modules', async ({ page }) => {
    // Navigate to System Settings
    await page.getByRole('button', { name: 'System Settings - Configure system' }).click();
    await expect(page).toHaveURL('/settings', { timeout: 10000 });

    // Back to dashboard
    await page.goto('/dashboard');

    // Navigate to Audit Logs
    await page.getByRole('button', { name: 'Audit Logs - View system activities' }).click();
    await expect(page).toHaveURL('/reports/audit-logs', { timeout: 10000 });

    // Back to dashboard
    await page.goto('/dashboard');

    // Navigate to User Management (note: links to employees list per current config)
    await page.getByRole('button', { name: 'User Management - Manage users and roles' }).click();
    await expect(page).toHaveURL('/employees', { timeout: 10000 });
  });
});

// ---------------------------- HR Dashboard ----------------------------

test.describe('Dashboard (HR Admin)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, creds.hr);
  });

  test('should show HR cards and charts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Welcome, HR Administrator\./i)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Approvals - Review pending requests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reports - Generate HR reports' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employees - Manage employee records' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Departments - Department structure' })).toBeVisible();

    await expect(page.getByText('Headcount by Department')).toBeVisible();
    await expect(page.getByText('Leave Status Breakdown')).toBeVisible();
  });
});

// ---------------------------- Supervisor Dashboard ----------------------------

test.describe('Dashboard (Supervisor)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, creds.supervisor);
  });

  test('should show Supervisor cards and chart', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Welcome, Department Supervisor\./i)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Team - Manage team members' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Approvals - Approve team requests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Team Leave - Team leave calendar' })).toBeVisible();

    await expect(page.getByText(/Team Requests\s+Last 30 Days/)).toBeVisible();
  });
});

// ---------------------------- Employee Dashboard ----------------------------

test.describe('Dashboard (Employee)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, creds.employee);
  });

  test('should show Employee quick links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Welcome, Regular Employee\./i)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Pass Slips - Request a pass slip' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Leave - Apply for leave' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Certificates - Request certificates' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Profile - View your profile' })).toBeVisible();
  });
});

