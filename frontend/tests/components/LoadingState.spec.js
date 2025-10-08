// NOTE: Requires vitest + @vue/test-utils to run.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingState from '@/components/LoadingState.vue'

describe('LoadingState', () => {
  it('renders spinner variant by default', () => {
    const wrapper = mount(LoadingState)
    expect(wrapper.html()).toContain('v-progress-circular')
  })

  it('accepts skeleton-table variant', () => {
    const wrapper = mount(LoadingState, { props: { variant: 'skeleton-table', rows: 3, columns: 2 } })
    expect(wrapper.html()).toContain('v-skeleton-loader')
  })
})

