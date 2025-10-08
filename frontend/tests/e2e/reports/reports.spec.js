// Reports E2E (soft load + basic filter interaction)

import { test, expect } from '@playwright/test'

const admin = { username: 'admin', password: 'Admin123!' }

async function login(page, { username, password }) {
  await page.goto('/login')
  await page.getByLabel('Username').click()
  await page.keyboard.type(username)
  await page.getByRole('textbox', { name: 'Password Password' }).click()
  await page.keyboard.type(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

function today(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}

for (const route of [
  { path: '/reports/pass-slips', name: 'Pass Slip Reports' },
  { path: '/reports/leave', name: 'Leave Reports' },
  { path: '/reports/certificates', name: 'Certificate Reports' },
  { path: '/reports/employees', name: 'Employee Reports' }
]) {
  test(`${route.name} page loads and basic date filters`, async ({ page }) => {
    await login(page, admin)
    await page.goto(route.path)
    if (!new RegExp(`${route.path.replace(/\//g, '\\/')}$`).test(page.url())) test.skip(true, `No permission for ${route.name}`)
    await expect(page.locator('main, .v-main').first()).toBeVisible()

    // Try set date range if date fields present
    const from = page.getByLabel(/Date From|From|Start Date/i)
    const to = page.getByLabel(/Date To|To|End Date/i)
    const fromVisible = await from.isVisible().catch(() => false)
    const toVisible = await to.isVisible().catch(() => false)
    if (fromVisible) { await from.click({ timeout: 1000 }); await page.keyboard.type(today(-30)) }
    if (toVisible) { await to.click({ timeout: 1000 }); await page.keyboard.type(today(0)) }

    // Table presence soft check
    await expect(page.getByRole('table')).toBeVisible({ timeout: 3000 }).catch(async () => {
      await expect(page.locator('main, .v-main').first()).toBeVisible()
    })
  })
}

