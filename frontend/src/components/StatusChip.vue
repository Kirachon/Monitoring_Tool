<template>
  <v-chip :color="chipColor" :variant="variant" :size="size" class="text-capitalize" :aria-label="`${status} status`">
    <v-icon v-if="icon" :icon="icon" start size="16" class="mr-1" aria-hidden="true" />
    <slot>{{ normalizedStatus }}</slot>
  </v-chip>
</template>

<script setup>
/**
 * StatusChip.vue
 * Consistent status indicators using semantic colors.
 */
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  size: { type: String, default: 'small' },
  icon: { type: String, default: '' },
  variant: { type: String, default: 'flat' } // flat | outlined | tonal
})

const normalizedStatus = computed(() => String(props.status || '').toLowerCase())

const chipColor = computed(() => {
  switch (normalizedStatus.value) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'denied': return 'error'
    case 'cancelled': return 'neutral500'
    case 'completed': return 'info'
    default: return 'primary'
  }
})
</script>

<style scoped>
</style>

