import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    toasts: [], // { id, type, message, timeout }
    inbox: [],  // { id, type, title, message, createdAt, read }
    nextId: 1
  }),
  getters: {
    unreadCount: (s) => s.inbox.filter(n => !n.read).length
  },
  actions: {
    show(type, message, timeout = 3000) {
      const id = this.nextId++
      this.toasts.push({ id, type, message, timeout })
      setTimeout(() => this.dismiss(id), timeout)
    },
    dismiss(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },
    addInbox({ type = 'info', title = '', message = '' }) {
      const id = this.nextId++
      this.inbox.unshift({ id, type, title, message, createdAt: new Date().toISOString(), read: false })
    },
    markRead(id) {
      const n = this.inbox.find(n => n.id === id)
      if (n) n.read = true
    },
    markAllRead() {
      this.inbox.forEach(n => { n.read = true })
    }
  }
})

