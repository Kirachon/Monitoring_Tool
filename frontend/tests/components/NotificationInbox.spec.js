import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NotificationInbox from '@/components/NotificationInbox.vue'
import { useNotificationStore } from '@/store/notification'

describe('NotificationInbox.vue', () => {
  it('shows empty state when no notifications', () => {
    setActivePinia(createPinia())
    const wrapper = mount(NotificationInbox)
    expect(wrapper.text()).toContain('No notifications')
  })

  it('renders notifications from store', () => {
    setActivePinia(createPinia())
    const store = useNotificationStore()
    store.addInbox({ type: 'info', title: 'Hello', message: 'World' })
    const wrapper = mount(NotificationInbox)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })
})

