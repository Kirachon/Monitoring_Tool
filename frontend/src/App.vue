<template>
  <!--
    App.vue serves as the root component.
    Layout components (MainLayout, etc.) are rendered via router-view.
    This allows different layouts for authenticated vs. public routes.
  -->
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

// Initialize auth store on app mount
const authStore = useAuthStore()

onMounted(() => {
  // Restore authentication state from localStorage if available
  authStore.initAuth()
})
</script>

<style>
/* Global app styles */
* {
  box-sizing: border-box;
}

html {
  overflow-y: auto;
}

body {
  margin: 0;
  padding: 0;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar styling (optional) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

