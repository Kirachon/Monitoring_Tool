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

test.describe('Permission Debug', () => {
  for (const [role, cred] of Object.entries(creds)) {
    test(`${role} - inspect permissions and nav state`, async ({ page }) => {
      await login(page, cred)
      
      // Extract user permissions from localStorage
      const user = await page.evaluate(() => {
        const u = localStorage.getItem('user')
        return u ? JSON.parse(u) : null
      })
      
      console.log(`\n=== ${role.toUpperCase()} ===`)
      console.log('User object:', JSON.stringify(user, null, 2))
      console.log('Permissions:', user?.permissions || [])
      console.log('Roles:', user?.roles || [])
      
      // Check if nav drawer is visible
      const drawer = page.locator('.v-navigation-drawer')
      await expect(drawer).toBeVisible()
      
      // Check specific menu items visibility (hidden vs visible)
      const passSlips = page.locator('.v-list-item', { hasText: 'Pass Slips' }).first()
      const leave = page.locator('.v-list-item', { hasText: 'Leave' }).first()
      const employees = page.locator('.v-list-item', { hasText: 'Employees' }).first()
      const users = page.locator('.v-list-item', { hasText: 'User Management' }).first()

      const passSlipsVisible = await passSlips.isVisible().catch(() => false)
      const leaveVisible = await leave.isVisible().catch(() => false)
      const employeesVisible = await employees.isVisible().catch(() => false)
      const usersVisible = await users.isVisible().catch(() => false)

      console.log('Pass Slips visible:', passSlipsVisible)
      console.log('Leave visible:', leaveVisible)
      console.log('Employees visible:', employeesVisible)
      console.log('User Management visible:', usersVisible)

      // Take screenshot
      await page.screenshot({ path: `test-results/debug-${role}-nav.png`, fullPage: false })
    })
  }
})

