<template>
  <v-container fluid class="pa-6">
    <PageHeader
      :title="title"
      :subtitle="subtitle"
      :breadcrumbs="breadcrumbs"
      :search-enabled="searchEnabled"
      v-model="searchModel"
      :search-placeholder="searchPlaceholder"
    >
      <template #actions>
        <slot name="actions" />
      </template>
      <template #filters>
        <slot name="filters" />
      </template>
    </PageHeader>

    <v-card>
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

const emit = defineEmits(['update:search'])
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  breadcrumbs: { type: Array, default: () => [] },
  searchEnabled: { type: Boolean, default: false },
  search: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Search' }
})

const searchModel = ref(props.search)
watch(() => props.search, (v) => { searchModel.value = v })
watch(searchModel, (v) => emit('update:search', v))
</script>

<style scoped>
</style>

