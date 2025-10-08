<template>
  <div aria-live="polite" aria-atomic="true">
    <v-snackbar
      v-for="t in toasts"
      :key="t.id"
      v-model="visibleMap[t.id]"
      :timeout="t.timeout"
      location="top right"
      :color="mapType(t.type)"
      class="mb-2"
      elevation="2"
    >
      {{ t.message }}
      <template #actions>
        <v-btn variant="text" icon="mdi-close" @click="dismiss(t.id)" :aria-label="'Dismiss notification'" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { reactive, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification'

const store = useNotificationStore()
const { toasts } = storeToRefs(store)

const visibleMap = reactive({})

watchEffect(() => {
  toasts.value.forEach(t => { visibleMap[t.id] = true })
})

const dismiss = (id) => store.dismiss(id)

const mapType = (type) => ({ success: 'success', error: 'error', warning: 'warning', info: 'info' }[type] || 'primary')
</script>

<style scoped>
</style>

