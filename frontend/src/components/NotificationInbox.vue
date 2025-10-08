<template>
  <v-card min-width="340" max-width="420" aria-label="Notifications inbox">
    <v-card-title class="d-flex align-center">
      <v-icon start>mdi-bell</v-icon>
      Notifications
      <v-spacer />
      <v-btn size="small" variant="text" @click="markAllRead" :aria-label="'Mark all as read'">Mark all</v-btn>
    </v-card-title>
    <v-divider />
    <v-list density="compact">
      <template v-if="inbox.length">
        <v-list-item v-for="n in inbox" :key="n.id">
          <template #prepend>
            <v-icon :color="mapType(n.type)" class="mr-2">{{ mapIcon(n.type) }}</v-icon>
          </template>
          <v-list-item-title class="d-flex align-center">
            <span class="mr-2" :class="{ 'font-weight-bold': !n.read }">{{ n.title || capitalize(n.type) }}</span>
            <v-chip v-if="!n.read" size="x-small" color="info" variant="tonal">new</v-chip>
          </v-list-item-title>
          <v-list-item-subtitle class="text-body-2">{{ n.message }}</v-list-item-subtitle>
          <template #append>
            <v-btn icon="mdi-check" variant="text" @click="markRead(n.id)" :aria-label="'Mark notification as read'" />
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-title>No notifications</v-list-item-title>
          <v-list-item-subtitle class="text-body-2">You're all caught up.</v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification'

const store = useNotificationStore()
const { inbox } = storeToRefs(store)

const markRead = (id) => store.markRead(id)
const markAllRead = () => store.markAllRead()

const mapType = (t) => ({ success: 'success', error: 'error', warning: 'warning', info: 'info' }[t] || 'primary')
const mapIcon = (t) => ({ success: 'mdi-check-circle', error: 'mdi-alert', warning: 'mdi-alert-circle', info: 'mdi-information' }[t] || 'mdi-bell')
const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '')
</script>

<style scoped>
</style>

