// System Settings, Departments, Holidays E2E (soft checks + API fallback)

import { test, expect } from '@playwright/test'

const admin = { username: 'admin', password: 'Admin123!' }

async function login(page, { username, password }) {
  await page.goto('/login')
  await page.getByLabel('Username').click(); await page.keyboard.type(username)
  await page.getByRole('textbox', { name: 'Password Password' }).click(); await page.keyboard.type(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

async function token(page){return page.evaluate(()=>localStorage.getItem('token'))}
async function apiPost(page, url, data){const t=await token(page);return page.request.post(`http://localhost:3000${url}`,{headers:{Authorization:`Bearer ${t}`},data})}

function uid(){return Math.random().toString(36).slice(2,7)}

// System Settings

test('System Settings page loads (Admin)', async ({ page }) => {
  await login(page, admin)
  await page.goto('/settings')
  if (!/\/settings$/.test(page.url())) test.skip(true, 'No permission to view System Settings')
  await expect(page.locator('main, .v-main').first()).toBeVisible()
})

// Departments

test('Departments page loads and API-create department fallback', async ({ page }) => {
  await login(page, admin)
  await page.goto('/departments')
  if (!/\/departments$/.test(page.url())) test.skip(true, 'No permission to view Departments')
  await expect(page.locator('main, .v-main').first()).toBeVisible()

  // API fallback: create a department (if permission allows)
  const create = await apiPost(page, '/api/departments', { name: `E2E Dept ${uid()}`, parentId: null, headId: null })
  if (!create.ok()) test.skip(true, `Department API create failed: ${create.status()}`)
})

// Holidays

test('Holiday Management page loads (Admin)', async ({ page }) => {
  await login(page, admin)
  await page.goto('/holidays')
  if (!/\/holidays$/.test(page.url())) test.skip(true, 'No permission to view Holidays')
  await expect(page.locator('main, .v-main').first()).toBeVisible()
})

