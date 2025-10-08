import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Authentication - Logout
 * Tests the logout functionality and session cleanup
 */

// Helper function to login
async function login(page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('textbox', { name: 'Password Password' }).fill('Admin123!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
}

test.describe('Logout Functionality', () => {
  test('should successfully logout and redirect to login page', async ({ page }) => {
    // Login first
    await login(page);
    
    // Open user menu
    await page.getByTestId('user-menu').click();
    
    // Click logout
    await page.getByRole('listitem').filter({ hasText: 'Logout' }).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    
    // Should show login form
    await expect(page.getByRole('heading', { name: 'Philippine Government HRMS' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
  });

  test('should clear authentication token on logout', async ({ page }) => {
    // Login first
    await login(page);
    
    // Verify token exists
    let token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Logout
    await page.getByTestId('user-menu').click();
    await page.getByRole('listitem').filter({ hasText: 'Logout' }).click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    
    // Verify token is cleared
    token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  test('should prevent access to protected routes after logout', async ({ page }) => {
    // Login first
    await login(page);
    
    // Logout
    await page.getByTestId('user-menu').click();
    await page.getByRole('listitem').filter({ hasText: 'Logout' }).click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect back to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('should show user menu with logout option', async ({ page }) => {
    // Login first
    await login(page);
    
    // Open user menu
    await page.getByTestId('user-menu').click();
    
    // Verify menu items (within list)
    await expect(page.getByRole('listitem').filter({ hasText: 'My Profile' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Change Password' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Logout' })).toBeVisible();
  });

  test('should handle logout from different pages', async ({ page }) => {
    // Login first
    await login(page);
    
    // Navigate to different page
    await page.goto('/employees');
    await page.waitForLoadState('networkidle');
    
    // Logout from this page
    await page.getByTestId('user-menu').click();
    await page.getByRole('listitem').filter({ hasText: 'Logout' }).click();
    
    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('should clear user data from store on logout', async ({ page }) => {
    // Login first
    await login(page);
    
    // Verify user is displayed (welcome banner)
    await expect(page.getByText(/Welcome, System Administrator/i)).toBeVisible();
    
    // Logout
    await page.getByTestId('user-menu').click();
    await page.getByRole('listitem').filter({ hasText: 'Logout' }).click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    
    // Try to access dashboard again (should redirect to login)
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });
});

test.describe('Logout Edge Cases', () => {
  test('should handle logout when already logged out', async ({ page }) => {
    // Go to login page (not logged in)
    await page.goto('/login');
    
    // Try to access logout directly
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('should handle logout with expired session', async ({ page }) => {
    // Login first
    await login(page);
    
    // Manually clear token to simulate expired session
    await page.evaluate(() => localStorage.removeItem('token'));
    
    // Try to navigate
    await page.goto('/employees');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });
});

