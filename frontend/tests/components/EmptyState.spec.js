// NOTE: Requires vitest + @vue/test-utils to run.
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  it('renders title and description', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No Data', description: 'There is nothing to show.' }
    })
    expect(wrapper.text()).toContain('No Data')
    expect(wrapper.text()).toContain('There is nothing to show.')
  })

  it('emits action when button clicked', async () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Empty', actionText: 'Create' }
    })
    // Target the v-btn stub via aria-label attribute to avoid Vuetify dependency in tests
    await wrapper.find('[aria-label="Create"]').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
  })
})

