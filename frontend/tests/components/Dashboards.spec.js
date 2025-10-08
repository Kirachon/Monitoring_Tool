import { mount } from '@vue/test-utils'
import AdminDashboard from '@/components/dashboards/AdminDashboard.vue'
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard.vue'

describe('Dashboards', () => {
  it('AdminDashboard renders key cards', () => {
    const w = mount(AdminDashboard)
    expect(w.text()).toContain('User Management')
  })
  it('EmployeeDashboard renders key cards', () => {
    const w = mount(EmployeeDashboard)
    expect(w.text()).toContain('Pass Slips')
  })
})

