import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const creds = {
  admin: { username: 'admin', password: 'Admin123!' },
  hradmin: { username: 'hradmin', password: 'HRAdmin123!' },
  supervisor: { username: 'supervisor', password: 'Supervisor123!' },
  employee: { username: 'employee', password: 'Employee123!' }
}

async function login(page, { username, password }) {
  await page.goto(`${BASE_URL}/login`)
  await page.getByLabel('Username').click()
  await page.keyboard.type(username)
  await page.getByRole('textbox', { name: /Password/i }).click()
  await page.keyboard.type(password)
  await page.getByRole('button', { name: /Sign In|Login/i }).click()
  await page.waitForURL(/\/dashboard$/, { timeout: 10000 })
}

test.describe('Manual Verification - Navigation Works', () => {
  test('Admin can access all features', async ({ page }) => {
    await login(page, creds.admin)
    
    // Verify navigation drawer is visible
    const drawer = page.locator('.v-navigation-drawer')
    await expect(drawer).toBeVisible()
    
    // Click Pass Slips (should work)
    await page.locator('.v-list-item', { hasText: 'Pass Slips' }).first().click()
    await page.waitForURL(/\/pass-slips$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/pass-slips$/)
    
    // Click Employees (should work)
    await page.locator('.v-list-item', { hasText: 'Employees' }).first().click()
    await page.waitForURL(/\/employees$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/employees$/)
    
    // Click User Management (should work)
    await page.locator('.v-list-item', { hasText: 'User Management' }).first().click()
    await page.waitForURL(/\/users$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/users$/)
    
    console.log('✅ Admin can access all features')
  })
  
  test('Employee can access allowed features only', async ({ page }) => {
    await login(page, creds.employee)
    
    // Verify navigation drawer is visible
    const drawer = page.locator('.v-navigation-drawer')
    await expect(drawer).toBeVisible()
    
    // Click Pass Slips (should work - employee has pass_slip.create)
    await page.locator('.v-list-item', { hasText: 'Pass Slips' }).first().click()
    await page.waitForURL(/\/pass-slips$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/pass-slips$/)
    
    // Click Leave (should work - employee has leave.create)
    await page.locator('.v-list-item', { hasText: 'Leave' }).first().click()
    await page.waitForURL(/\/leave$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/leave$/)
    
    // Try to access Employees directly via URL (should be blocked by router guard)
    await page.goto(`${BASE_URL}/employees`)
    await page.waitForLoadState('networkidle')
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/)
    
    console.log('✅ Employee can access allowed features and is blocked from restricted features')
  })
  
  test('HR Admin can access HR features', async ({ page }) => {
    await login(page, creds.hradmin)
    
    // Click Employees (should work - HR Admin has employee.write)
    await page.locator('.v-list-item', { hasText: 'Employees' }).first().click()
    await page.waitForURL(/\/employees$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/employees$/)
    
    // Try to access User Management directly via URL (should be blocked - HR Admin lacks system.admin)
    await page.goto(`${BASE_URL}/users`)
    await page.waitForLoadState('networkidle')
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/)
    
    console.log('✅ HR Admin can access HR features and is blocked from system admin features')
  })
  
  test('Supervisor can access approval features', async ({ page }) => {
    await login(page, creds.supervisor)
    
    // Expand Approvals group
    const approvalsGroup = page.locator('.v-list-group').filter({ hasText: 'Approvals' })
    await approvalsGroup.locator('.v-list-item').first().click()
    await page.waitForTimeout(500)
    
    // Click Leave Requests approval (should work - Supervisor has leave.approve)
    await page.locator('.v-list-item', { hasText: 'Leave Requests' }).click()
    await page.waitForURL(/\/leave\/approvals$/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/leave\/approvals$/)
    
    console.log('✅ Supervisor can access approval features')
  })
})

