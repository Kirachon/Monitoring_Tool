<template>
  <!-- Dashboard content - rendered inside MainLayout -->
  <v-container fluid class="pa-6">
    <PageHeader title="Dashboard" subtitle="Welcome to the Philippine Government HRMS" />

    <v-row class="mt-2">
      <v-col cols="12">
        <v-alert type="info" variant="tonal" border="start">
          Welcome, {{ authStore.fullName }}.
        </v-alert>
      </v-col>
    </v-row>

    <component :is="activeDashboard" />
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import PageHeader from '@/components/PageHeader.vue'
import AdminDashboard from '@/components/dashboards/AdminDashboard.vue'
import HRDashboard from '@/components/dashboards/HRDashboard.vue'
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard.vue'
import SupervisorDashboard from '@/components/dashboards/SupervisorDashboard.vue'

const authStore = useAuthStore()

const rolesArr = computed(() => (authStore.user?.roles || []).map(r => r.toLowerCase()))
const isAdmin = computed(() => authStore.hasPermission('system.admin') || rolesArr.value.includes('system administrator') || authStore.user?.username === 'admin')
const activeDashboard = computed(() => {
  if (isAdmin.value) return AdminDashboard
  if (rolesArr.value.some(r => r.includes('hr') || r.includes('human resource')) || authStore.user?.username === 'hradmin') return HRDashboard
  if (rolesArr.value.includes('supervisor') || authStore.user?.username === 'supervisor') return SupervisorDashboard
  return EmployeeDashboard
})
</script>

<style scoped>
/* Dashboard-specific styles */
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>

