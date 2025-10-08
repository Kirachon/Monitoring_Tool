<template>
  <v-container fluid>
    <PageHeader title="System Settings" subtitle="Configure global HRMS settings" />

    <v-row class="mt-2">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Configuration</v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item :to="{ name: 'DepartmentManagement' }" prepend-icon="mdi-office-building">
                <v-list-item-title>Departments</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'HolidayManagement' }" prepend-icon="mdi-calendar-star">
                <v-list-item-title>Holidays</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'DigitalSignatures' }" prepend-icon="mdi-draw">
                <v-list-item-title>Digital Signatures</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'UserManagement' }" prepend-icon="mdi-account-cog">
                <v-list-item-title>Users & Roles</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Environment</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>API Base URL</td>
                  <td>{{ apiBaseUrl }}</td>
                </tr>
                <tr>
                  <td>App Version</td>
                  <td>{{ appVersion }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-alert type="info" variant="tonal" class="mt-4">
              This page aggregates existing configuration links. Advanced settings can be added incrementally.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

const apiBaseUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
const appVersion = computed(() => import.meta.env.VITE_APP_VERSION || 'dev')
</script>

