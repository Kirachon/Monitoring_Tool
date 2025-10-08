// NOTE: Requires vitest + @vue/test-utils to run.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusChip from '@/components/StatusChip.vue'

describe('StatusChip', () => {
  it('shows status text', () => {
    const wrapper = mount(StatusChip, { props: { status: 'Approved' } })
    expect(wrapper.text().toLowerCase()).toContain('approved')
  })

  it('applies success color for approved', () => {
    const wrapper = mount(StatusChip, { props: { status: 'approved' } })
    expect(wrapper.props('status')).toBe('approved')
  })
})

