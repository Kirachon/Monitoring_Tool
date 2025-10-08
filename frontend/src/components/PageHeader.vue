<template>
  <div class="mb-6" role="banner" aria-label="Page header">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="d-flex align-center" style="gap: 8px;">
        <slot name="prepend" />
        <v-btn
          v-if="backEnabled && backTarget"
          variant="text"
          size="small"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
          aria-label="Go back"
        >Back</v-btn>
        <h1 class="text-h4" :id="headingId">{{ title }}</h1>
      </div>
      <div class="d-flex align-center" aria-label="Page actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="d-flex align-center justify-space-between flex-wrap gap-2">
      <div class="text-subtitle-1" v-if="subtitle">{{ subtitle }}</div>
      <div class="d-flex align-center ml-auto" style="gap: 8px;">
        <slot name="filters" />
        <v-text-field
          v-if="searchEnabled"
          :model-value="internalSearch"
          @update:modelValue="onSearchInput"
          :label="searchPlaceholder"
          prepend-icon="mdi-magnify"
          hide-details
          density="compact"
          clearable
          style="max-width: 320px;"
          :aria-label="searchPlaceholder"
        />
        <v-breadcrumbs v-if="breadcrumbs && breadcrumbs.length" :items="breadcrumbs" class="ml-2" />
      </div>
    </div>

    <v-divider class="mt-4" />
  </div>
</template>

<script setup>
/**
 * PageHeader.vue
 * Standardized page header with title, optional subtitle, breadcrumbs and actions slot.
 */
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  breadcrumbs: { type: Array, default: () => [] },
  id: { type: String, default: '' },
  searchEnabled: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Search' },
  searchDebounce: { type: Number, default: 300 },
  backEnabled: { type: Boolean, default: true }
})

const headingId = computed(() => props.id || 'page-title')

const internalSearch = ref(props.modelValue)

// Back target derived from breadcrumbs (previous item with a route)
const backTarget = computed(() => {
  if (!props.breadcrumbs || props.breadcrumbs.length < 2) return null
  const prev = props.breadcrumbs[props.breadcrumbs.length - 2]
  return prev && prev.to ? prev.to : null
})

import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  if (backTarget.value) router.push(backTarget.value)
}

let debounceTimer
const onSearchInput = (val) => {
  internalSearch.value = val
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('update:modelValue', internalSearch.value), props.searchDebounce)
}

watch(() => props.modelValue, (v) => { internalSearch.value = v })
</script>

<style scoped>
/* Keep spacing consistent */
</style>

