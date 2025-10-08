<template>
  <v-container class="text-center py-12">
    <EmptyState icon="mdi-cancel" title="Access Forbidden" description="You don't have permission to access this page." actionText="Back to Dashboard" @action="$router.push('/dashboard')" />
  </v-container>
</template>
<script setup>
import EmptyState from '@/components/EmptyState.vue'
</script>

