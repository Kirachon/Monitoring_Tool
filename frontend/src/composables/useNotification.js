/**
 * Notification Composable
 * Provides notification utilities (using console for now, can be enhanced with toast library)
 */

import { useNotificationStore } from '@/store/notification'

export function useNotification() {
  const store = useNotificationStore()
  /**
   * Show success notification
   * @param {string} message - Success message
   */
  const showSuccess = (message) => store.show('success', message)
  
  /**
   * Show error notification
   * @param {string} message - Error message
   */
  const showError = (message) => store.show('error', message)
  
  /**
   * Show info notification
   * @param {string} message - Info message
   */
  const showInfo = (message) => store.show('info', message)
  
  /**
   * Show warning notification
   * @param {string} message - Warning message
   */
  const showWarning = (message) => store.show('warning', message)
  
  const addInbox = (payload) => store.addInbox(payload)

  return { showSuccess, showError, showInfo, showWarning, addInbox }
}

