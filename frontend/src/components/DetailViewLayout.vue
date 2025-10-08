<template>
  <v-container fluid class="pa-6">
    <PageHeader :title="title" :subtitle="subtitle" :breadcrumbs="breadcrumbs">
      <template #actions>
        <slot name="actions" />
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
import PageHeader from '@/components/PageHeader.vue'
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  breadcrumbs: { type: Array, default: () => [] }
})
</script>

<style scoped>
</style>

