<template>
  <v-container class="text-center py-12">
    <EmptyState icon="mdi-magnify-close" title="Page Not Found" description="The page you are looking for does not exist." actionText="Go to Dashboard" @action="$router.push('/dashboard')" />
  </v-container>
</template>
<script setup>
import EmptyState from '@/components/EmptyState.vue'
</script>

