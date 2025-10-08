<template>
  <div :aria-busy="true" aria-live="polite">
    <template v-if="variant === 'spinner'">
      <div class="d-flex align-center justify-center py-6">
        <v-progress-circular indeterminate :size="48" color="primary" aria-label="Loading" />
      </div>
    </template>

    <template v-else-if="variant === 'overlay'">
      <v-overlay :model-value="true" class="align-center justify-center">
        <v-progress-circular indeterminate :size="64" color="primary" aria-label="Loading" />
      </v-overlay>
    </template>

    <template v-else-if="variant === 'skeleton-table'">
      <v-skeleton-loader type="table" :loading="true" :types="{ table: `heading, ${rows}x${columns}`, heading: 'table-heading' }" />
    </template>

    <template v-else-if="variant === 'skeleton-card'">
      <v-skeleton-loader type="image, card-heading, list-item-three-line" />
    </template>

    <template v-else>
      <v-skeleton-loader type="paragraph" />
    </template>
  </div>
</template>

<script setup>
/**
 * LoadingState.vue
 * Consistent loading indicators and skeletons.
 */
const props = defineProps({
  variant: { type: String, default: 'spinner' }, // spinner | overlay | skeleton-table | skeleton-card | skeleton-form
  rows: { type: Number, default: 5 },
  columns: { type: Number, default: 4 },
  height: { type: [Number, String], default: 300 }
})
</script>

<style scoped>
</style>

