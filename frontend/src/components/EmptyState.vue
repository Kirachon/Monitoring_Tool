<template>
  <div class="text-center py-6" role="status" :aria-label="ariaLabel">
    <div class="mb-4">
      <v-icon v-if="icon && !illustration" :icon="icon" size="48" class="mb-2" aria-hidden="true" />
      <img v-if="illustration" :src="illustration" :alt="title" style="max-width: 200px" class="mb-2" />
    </div>
    <div class="text-h6 mb-2">{{ title }}</div>
    <div class="text-body-2 mb-4">{{ description }}</div>
    <div v-if="$slots.default">
      <slot />
    </div>
    <v-btn v-else-if="actionText" :color="actionColor" @click="onAction" :aria-label="actionText">
      {{ actionText }}
    </v-btn>
  </div>
</template>

<script setup>
/**
 * EmptyState.vue
 * Reusable empty state component for no-data, no-results, error, and no-permission states.
 */
const emit = defineEmits(['action'])
const props = defineProps({
  icon: { type: String, default: 'mdi-inbox-outline' },
  illustration: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' },
  actionColor: { type: String, default: 'primary' },
  variant: { type: String, default: 'no-data' } // 'no-data' | 'no-results' | 'error' | 'no-permission'
})

const onAction = () => emit('action')

const ariaLabel = `${props.variant.replace('-', ' ')} empty state`
</script>

<style scoped>
</style>

