<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Audit Log Viewer</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3"><v-text-field v-model="filters.module" label="Module" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.action" label="Action" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateFrom" label="From" type="date" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateTo" label="To" type="date" /></v-col>
          <v-col cols="12" class="d-flex align-end gap-2">
            <v-btn color="primary" @click="load">Run</v-btn>
            <v-btn variant="tonal" @click="exportCsv">Export CSV</v-btn>
          </v-col>
        </v-row>
        <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
        <v-data-table :headers="headers" :items="rows" :loading="loading" density="compact">
          <template #item.details="{ item }">
            <pre style="white-space: pre-wrap;">{{ formatDetails(item.details) }}</pre>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import reportService from '@/services/reportService'
const filters = ref({ module: '', action: '', dateFrom: '', dateTo: '' })
const rows = ref([])
const loading = ref(false)
const error = ref(null)
const headers = [
  { title: 'Date', key: 'createdAt' },
  { title: 'User', key: 'username' },
  { title: 'Module', key: 'module' },
  { title: 'Action', key: 'action' },
  { title: 'Entity', key: 'entityType' },
  { title: 'ID', key: 'entityId' },
  { title: 'IP', key: 'ip' },
  { title: 'Details', key: 'details' }
]
function formatDetails(val){
  if (!val) return ''
  try { return JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val, null, 2) } catch { return String(val) }
}
async function load(){
  loading.value = true; error.value = null
  try{ const res = await reportService.auditLogs(filters.value); rows.value = res.data.rows }
  catch(e){ error.value = e.response?.data?.error?.message || 'Failed to load' }
  finally{ loading.value = false }
}
async function exportCsv(){
  try{
    const resp = await reportService.auditLogsExport(filters.value)
    const blob = new Blob([resp.data], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='audit_logs.csv'; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Export failed' }
}
</script>

