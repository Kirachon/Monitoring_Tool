// NOTE: Requires vitest + @vue/test-utils to run.
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionCard from '@/components/ActionCard.vue'

describe('ActionCard', () => {
  it('renders title and description', () => {
    const wrapper = mount(ActionCard, { props: { title: 'Create Request', description: 'Start a new pass slip request' } })
    expect(wrapper.text()).toContain('Create Request')
    expect(wrapper.text()).toContain('Start a new pass slip request')
  })

  it('emits click when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ActionCard, { props: { title: 'Go' }, attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})

