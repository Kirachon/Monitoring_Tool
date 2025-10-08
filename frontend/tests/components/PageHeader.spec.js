// NOTE: This test uses Vitest + @vue/test-utils conventions.
// Running requires installing dev deps: vitest, @vue/test-utils, jsdom.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from '@/components/PageHeader.vue'

describe('PageHeader', () => {
  it('renders title and optional subtitle', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Employees', subtitle: 'Manage employees' }
    })
    expect(wrapper.text()).toContain('Employees')
    expect(wrapper.text()).toContain('Manage employees')
  })

  it('renders breadcrumbs when provided', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Employees', breadcrumbs: [{ title: 'Home', to: '/' }, { title: 'Employees' }] }
    })
    expect(wrapper.html()).toContain('v-breadcrumbs')
  })

  it('optionally shows search when enabled', async () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'List', searchEnabled: true, modelValue: '', searchPlaceholder: 'Search' }
    })
    expect(wrapper.html()).toContain('v-text-field')
  })
})

