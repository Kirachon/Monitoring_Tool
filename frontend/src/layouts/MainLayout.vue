<template>
  <v-app>
    <!-- Navigation Drawer -->
    <NavigationDrawer />

    <!-- App Bar -->
    <v-app-bar
      color="primary"
      prominent
      elevation="2"
    >
      <v-app-bar-title class="text-h6 font-weight-bold">
        <v-icon icon="mdi-shield-account" class="mr-2" size="large" />
        Philippine Government HRMS
      </v-app-bar-title>

      <v-spacer />

      <!-- Global Search -->
      <v-btn
        icon
        variant="text"
        class="mr-2"
        aria-label="Search (Ctrl+K)"
        @click="showSearch = true"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- Notifications -->
      <v-menu v-model="notifMenu" :close-on-content-click="false" location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-bell-outline"
            variant="text"
            class="mr-2"
            aria-label="Notifications"
          >
            <v-icon>mdi-bell-outline</v-icon>
            <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" floating />
          </v-btn>
        </template>
        <NotificationInbox />
      </v-menu>

      <!-- User Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-account-circle"
            data-testid="user-menu"
            class="text-none"
          >
            {{ authStore.fullName }}
          </v-btn>
        </template>

        <v-list min-width="250">
          <!-- User Info Header -->
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                <v-img
                  :src="userAvatar"
                  :alt="authStore.fullName"
                />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">
              {{ authStore.fullName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ authStore.user?.username }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption">
              {{ authStore.rolesString }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2" />

          <!-- Profile Link -->
          <v-list-item
            to="/profile"
            prepend-icon="mdi-account"
          >
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item>

          <!-- Change Password -->
          <v-list-item
            to="/change-password"
            prepend-icon="mdi-lock-reset"
          >
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2" />

          <!-- Logout -->
          <v-list-item
            @click="handleLogout"
            prepend-icon="mdi-logout"
            base-color="error"
          >
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <!-- Offline Indicator -->
      <v-alert v-if="!isOnline" type="warning" density="compact" variant="tonal" border="start" class="ma-2" aria-live="polite">
        You are offline. Some features may be unavailable.
      </v-alert>

      <!-- Loading Overlay -->
      <v-overlay
        v-model="isLoading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        />
        <div class="text-h6 mt-4">Loading...</div>
      </v-overlay>

      <!-- Error Boundary -->
      <v-container v-if="hasError" fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <v-alert
              type="error"
              variant="tonal"
              prominent
              border="start"
              closable
              @click:close="clearError"
            >
              <v-alert-title class="text-h6 mb-2">
                <v-icon icon="mdi-alert-circle" class="mr-2" />
                An Error Occurred
              </v-alert-title>
              <div class="text-body-1">{{ errorMessage }}</div>
              <template v-slot:append>
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="reloadPage"
                  class="mt-4"
                >
                  Reload Page
                </v-btn>
              </template>
            </v-alert>
          </v-col>
        </v-row>
      </v-container>

      <!-- Router View - Actual Page Content -->
      <router-view v-else v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </v-main>

    <!-- Footer (Optional) -->
    <v-footer
      app
      color="surface-variant"
      elevation="4"
      class="text-center"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <span class="text-caption">
              © {{ currentYear }} Philippine Government HRMS |
              <a href="#" class="text-decoration-none">Privacy Policy</a> |
              <a href="#" class="text-decoration-none">Terms of Service</a>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Global Search Dialog -->
    <GlobalSearch v-model="showSearch" />

    <!-- Global Notification Toasts -->
    <NotificationToasts />
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification'
import NotificationToasts from '@/components/NotificationToasts.vue'
import NotificationInbox from '@/components/NotificationInbox.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'

// Global search state and keyboard shortcut (Ctrl/Cmd + K)
const showSearch = ref(false)

const onKeyDown = (e) => {
  const key = e.key.toLowerCase()

  // Ignore shortcuts while typing in inputs/textareas/contenteditable
  if (inEditable(document.activeElement)) return

  // Global search
  if ((e.ctrlKey || e.metaKey) && key === 'k') {
    e.preventDefault()
    showSearch.value = true
    resetSequence()
    return
  }

  // Sequence start
  if (!awaitingKey && key === 'g') {
    awaitingKey = true
    seqTimer = setTimeout(() => resetSequence(), seqWindowMs)
    return
  }

  // Sequence handling
  if (awaitingKey) {
    e.preventDefault()
    handleSequence(key)
    resetSequence()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('online', () => (isOnline.value = true))
  window.addEventListener('offline', () => (isOnline.value = false))
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('online', () => (isOnline.value = true))
  window.removeEventListener('offline', () => (isOnline.value = false))
})
// Lightweight nav shortcuts: g then [d=Dashboard, p=Pass Slips, l=Leave, a=Approvals]
let seqTimer = null
let awaitingKey = false

const inEditable = (el) => !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)

const handleSequence = (key) => {
  const map = {
    d: '/dashboard',
    p: '/pass-slips',
    l: '/leave',
    a: '/leave/approvals'
  }
  const to = map[key]
  if (to) router.push(to)
}

const resetSequence = () => {
  awaitingKey = false
  if (seqTimer) { clearTimeout(seqTimer); seqTimer = null }
}

const seqWindowMs = 1500


// Store and router
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Notifications
const notifStore = useNotificationStore()
const { unreadCount } = storeToRefs(notifStore)
const notifMenu = ref(false)

// State
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

// Clear error boundary state on route change
// This ensures navigation works correctly after errors are resolved
watch(() => route.path, () => {
  if (hasError.value) {
    hasError.value = false
    errorMessage.value = ''
  }
})

// Computed
const currentYear = computed(() => new Date().getFullYear())

const userAvatar = computed(() => {
  // Generate avatar from user's name
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.fullName)}&background=0038A8&color=fff&size=128`
})

// Methods
const handleLogout = async () => {
  try {
    isLoading.value = true
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    errorMessage.value = 'Failed to logout. Please try again.'
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const clearError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const reloadPage = () => {
  window.location.reload()
}

// Error boundary - catch errors from child components
onErrorCaptured((err, instance, info) => {
  console.error('Error captured in MainLayout:', err, info)
  errorMessage.value = err.message || 'An unexpected error occurred'
  hasError.value = true

  // Return false to prevent error from propagating further
  return false
})
</script>

<style scoped>
/* Fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none !important;
  }
}

/* Ensure main content area fills available space */
.v-main {
  min-height: calc(100vh - 64px - 48px); /* viewport - app-bar - footer */
}

/* Link styling in footer */
.v-footer a {
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.v-footer a:hover {
  opacity: 1;
}
</style>

