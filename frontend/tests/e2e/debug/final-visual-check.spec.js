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

test.describe('Final Visual Check - Navigation Drawer', () => {
  test('Admin - sees all menu items', async ({ page }) => {
    await login(page, creds.admin)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/final-admin-nav.png', fullPage: false })
    
    // Verify all sections visible
    await expect(page.locator('.v-list-item', { hasText: 'Pass Slips' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Leave' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Employees' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'User Management' }).first()).toBeVisible()
    
    console.log('✅ Admin sees all menu items')
  })
  
  test('HR Admin - sees HR items, no system items', async ({ page }) => {
    await login(page, creds.hradmin)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/final-hradmin-nav.png', fullPage: false })
    
    // Verify HR items visible
    await expect(page.locator('.v-list-item', { hasText: 'Pass Slips' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Leave' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Employees' }).first()).toBeVisible()
    
    // Verify system items NOT visible
    const userMgmt = page.locator('.v-list-item', { hasText: 'User Management' }).first()
    await expect(userMgmt).not.toBeVisible()
    
    console.log('✅ HR Admin sees HR items, system items hidden')
  })
  
  test('Supervisor - sees approvals, no HR/system items', async ({ page }) => {
    await login(page, creds.supervisor)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/final-supervisor-nav.png', fullPage: false })
    
    // Verify basic items visible
    await expect(page.locator('.v-list-item', { hasText: 'Pass Slips' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Leave' }).first()).toBeVisible()
    
    // Verify HR/system items NOT visible
    const employees = page.locator('.v-list-item', { hasText: 'Employees' }).first()
    await expect(employees).not.toBeVisible()
    
    const userMgmt = page.locator('.v-list-item', { hasText: 'User Management' }).first()
    await expect(userMgmt).not.toBeVisible()
    
    console.log('✅ Supervisor sees approvals, HR/system items hidden')
  })
  
  test('Employee - sees only self-service items', async ({ page }) => {
    await login(page, creds.employee)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/final-employee-nav.png', fullPage: false })
    
    // Verify self-service items visible
    await expect(page.locator('.v-list-item', { hasText: 'Pass Slips' }).first()).toBeVisible()
    await expect(page.locator('.v-list-item', { hasText: 'Leave' }).first()).toBeVisible()
    
    // Verify other items NOT visible
    const employees = page.locator('.v-list-item', { hasText: 'Employees' }).first()
    await expect(employees).not.toBeVisible()
    
    const userMgmt = page.locator('.v-list-item', { hasText: 'User Management' }).first()
    await expect(userMgmt).not.toBeVisible()
    
    // Verify no "Approvals" section header
    const approvalsHeader = page.locator('.v-list-subheader', { hasText: 'Approvals' })
    await expect(approvalsHeader).not.toBeVisible()
    
    console.log('✅ Employee sees only self-service items')
  })
})

