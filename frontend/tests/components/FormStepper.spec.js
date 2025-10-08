import { mount } from '@vue/test-utils'
import FormStepper from '@/components/FormStepper.vue'

describe('FormStepper.vue', () => {
  it('mounts successfully with steps prop', () => {
    const steps = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }]
    const wrapper = mount(FormStepper, { props: { steps, modelValue: 1 } })
    expect(wrapper.exists()).toBe(true)
  })
})

