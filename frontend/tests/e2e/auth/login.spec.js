import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Authentication - Login
 * Tests the login functionality and session management
 */

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Philippine Government HRMS/);

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Philippine Government HRMS' })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Remember me')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit without filling fields
    const loginButton = page.getByRole('button', { name: 'Login' });
    
    // Button should be disabled initially
    await expect(loginButton).toBeDisabled();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Ensure form is visible
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password Password' })).toBeVisible();

    // Fill in invalid credentials (type to trigger reactivity)
    await page.getByLabel('Username').click();
    await page.keyboard.type('invaliduser');
    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.keyboard.type('wrongpassword');

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 3000 });

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for error message
    await expect(page.getByText(/Invalid username or password/i)).toBeVisible({ timeout: 7000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Fill in valid credentials (system admin) using keyboard input
    await page.getByLabel('Username').click();
    await page.keyboard.type('admin');

    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.keyboard.type('Admin123!');

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 2000 });

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait a bit to see if there's an error
    await page.waitForTimeout(2000);

    // Check if there's an error message
    const errorAlert = page.locator('.v-alert--error');
    if (await errorAlert.isVisible()) {
      const errorText = await errorAlert.textContent();
      console.log('ERROR MESSAGE:', errorText);
    }

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Verify dashboard elements
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Welcome, System Administrator/i)).toBeVisible();
  });

  test('should persist session with "Remember me" checked', async ({ page, context }) => {
    // Fill in credentials
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.getByRole('textbox', { name: 'Password Password' }).fill('Admin123!');

    // Check "Remember me"
    await page.getByRole('checkbox', { name: 'Remember me' }).check();

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 2000 });

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for redirect
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Check that auth token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    // First login
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.getByRole('textbox', { name: 'Password Password' }).fill('Admin123!');

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 2000 });

    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Try to navigate back to login
    await page.goto('/login');

    // Should redirect back to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept login API and simulate network failure
    await page.route('**/api/auth/login', route => route.abort('failed'));

    // Try to login
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.getByRole('textbox', { name: 'Password Password' }).fill('Admin123!');

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 2000 });

    await page.getByRole('button', { name: 'Login' }).click();

    // Should show network error message from UI
    await expect(page.getByText(/Login failed|connection/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Login Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should not expose password in DOM', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Password Password' });
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should clear password field on failed login', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).click();
    await page.getByRole('textbox', { name: 'Password Password' }).fill('wrongpassword');

    // Wait for button to be enabled
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 2000 });

    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for error
    await expect(page.getByText(/Invalid username or password/i)).toBeVisible({ timeout: 5000 });

    // Password field should be cleared for security
    const passwordValue = await page.getByRole('textbox', { name: 'Password Password' }).inputValue();
    expect(passwordValue).toBe('');
  });
});

