<template>
  <v-container class="text-center py-12">
    <EmptyState icon="mdi-alert" title="Server Error" description="Something went wrong on our side. Please try again later." actionText="Go Home" @action="$router.push('/dashboard')" />
  </v-container>
</template>
<script setup>
import EmptyState from '@/components/EmptyState.vue'
</script>

