import { mount } from '@vue/test-utils'
import HelpTooltip from '@/components/HelpTooltip.vue'

describe('HelpTooltip.vue', () => {
  it('renders tooltip wrapper', () => {
    const wrapper = mount(HelpTooltip, { props: { text: 'Helpful info' } })
    expect(wrapper.html()).toContain('v-tooltip')
  })
})

