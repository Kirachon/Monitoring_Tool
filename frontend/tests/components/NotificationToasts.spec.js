import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NotificationToasts from '@/components/NotificationToasts.vue'
import { useNotificationStore } from '@/store/notification'

describe('NotificationToasts.vue', () => {
  it('renders toast message from store', async () => {
    setActivePinia(createPinia())
    const store = useNotificationStore()
    const wrapper = mount(NotificationToasts)
    store.show('success', 'Saved!')
    // Allow reactivity to propagate
    await new Promise(r => setTimeout(r, 10))
    expect(wrapper.text()).toContain('Saved!')
  })
})

