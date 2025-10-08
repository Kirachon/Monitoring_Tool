import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

async function loginViaAPI(page, { username, password }) {
  const resp = await page.request.post(`${BASE_URL}/api/auth/login`, {
    data: { username, password }
  })
  if (!resp.ok()) throw new Error(`Login failed: ${resp.status()} ${await resp.text()}`)
  const json = await resp.json()
  const token = json?.data?.token
  const user = json?.data?.user
  await page.addInitScript(([t, u]) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }, [token, user])
}

async function gotoAndSnap(page, path, filename) {
  await page.goto(path)
  // Give UI time to settle (Vuetify layouts/transitions)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `test-results/visual-${filename}.png`, fullPage: false })
}

const admin = { username: 'admin', password: 'Admin123!' }
const hradmin = { username: 'hradmin', password: 'HRAdmin123!' }
const supervisor = { username: 'supervisor', password: 'Supervisor123!' }
const employee = { username: 'employee', password: 'Employee123!' }

// Admin visual tour
test.describe('Visual Smoke - Admin', () => {
  test('capture key pages (admin)', async ({ page }) => {
    await loginViaAPI(page, admin)
    await gotoAndSnap(page, `${BASE_URL}/dashboard`, 'admin-dashboard')
    await gotoAndSnap(page, `${BASE_URL}/employees`, 'admin-employees')
    await gotoAndSnap(page, `${BASE_URL}/departments`, 'admin-departments')
    await gotoAndSnap(page, `${BASE_URL}/pass-slips`, 'admin-pass-slips')
    await gotoAndSnap(page, `${BASE_URL}/leave`, 'admin-leave')
    await gotoAndSnap(page, `${BASE_URL}/reports/employees`, 'admin-reports-employees')
    await gotoAndSnap(page, `${BASE_URL}/certificates/templates`, 'admin-cert-templates')
    await gotoAndSnap(page, `${BASE_URL}/settings`, 'admin-settings')
    await gotoAndSnap(page, `${BASE_URL}/users`, 'admin-users')
  })
})

// HR Admin visual tour
test.describe('Visual Smoke - HR Admin', () => {
  test('capture key pages (hradmin)', async ({ page }) => {
    await loginViaAPI(page, hradmin)
    await gotoAndSnap(page, `${BASE_URL}/dashboard`, 'hradmin-dashboard')
    await gotoAndSnap(page, `${BASE_URL}/employees`, 'hradmin-employees')
    await gotoAndSnap(page, `${BASE_URL}/departments`, 'hradmin-departments')
    await gotoAndSnap(page, `${BASE_URL}/certificates/templates`, 'hradmin-cert-templates')
    await gotoAndSnap(page, `${BASE_URL}/reports/employees`, 'hradmin-reports-employees')
  })
})

// Supervisor visual tour
test.describe('Visual Smoke - Supervisor', () => {
  test('capture key pages (supervisor)', async ({ page }) => {
    await loginViaAPI(page, supervisor)
    await gotoAndSnap(page, `${BASE_URL}/dashboard`, 'supervisor-dashboard')
    await gotoAndSnap(page, `${BASE_URL}/leave/approvals`, 'supervisor-leave-approvals')
    await gotoAndSnap(page, `${BASE_URL}/pass-slips/approvals`, 'supervisor-pass-slip-approvals')
    await gotoAndSnap(page, `${BASE_URL}/reports/leave`, 'supervisor-reports-leave')
  })
})

// Employee visual tour
test.describe('Visual Smoke - Employee', () => {
  test('capture key pages (employee)', async ({ page }) => {
    await loginViaAPI(page, employee)
    await gotoAndSnap(page, `${BASE_URL}/dashboard`, 'employee-dashboard')
    await gotoAndSnap(page, `${BASE_URL}/pass-slips`, 'employee-pass-slips')
    await gotoAndSnap(page, `${BASE_URL}/leave`, 'employee-leave')
  })
})

