import { mount } from '@vue/test-utils'
import DialogWrapper from '@/components/DialogWrapper.vue'

describe('DialogWrapper.vue', () => {
  it('renders title and slots', () => {
    const wrapper = mount(DialogWrapper, {
      props: { modelValue: true, title: 'Confirm Action' },
      slots: { default: '<div>Body</div>', actions: '<button>OK</button>' }
    })
    expect(wrapper.text()).toContain('Confirm Action')
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('OK')
  })
})

