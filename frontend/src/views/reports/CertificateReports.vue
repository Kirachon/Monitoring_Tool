<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Certificate Reports</v-card-title>
      <v-card-text>
            <v-row>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateFrom" label="From" type="date" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateTo" label="To" type="date" /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.type" :items="types" label="Type" clearable /></v-col>
          <v-col cols="12" md="3">
            <div class="d-flex flex-wrap align-end ga-2">
              <v-btn color="primary" @click="load" aria-label="Run report">Run</v-btn>
              <v-btn variant="tonal" @click="exportExcel" aria-label="Export to Excel">Export Excel</v-btn>
              <v-btn variant="tonal" @click="exportPdf" aria-label="Export to PDF">Export PDF</v-btn>
              <v-btn variant="text" @click="exportCsv" aria-label="Export CSV">CSV</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
        <v-skeleton-loader v-if="loading" type="table" :loading="loading" aria-label="Loading table" />
        <v-data-table v-else hover :headers="headers" :items="filteredRows" density="compact" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import reportService from '@/services/reportService'
import { exportToExcel, exportToPDF } from '@/utils/exportUtils'
const filters = ref({ dateFrom: '', dateTo: '', type: '' })
const types = ['Employment','Salary','Service Record','Good Standing']
const rows = ref([])
const loading = ref(false)
const error = ref(null)
const headers = [
  { title: 'Ref No', key: 'referenceNo' },
  { title: 'Employee', key: 'employeeName' },
  { title: 'Template', key: 'templateName' },
  { title: 'Type', key: 'certificateType' },
  { title: 'Issued', key: 'issuedDate' },
  { title: 'Status', key: 'status' }
]
const filteredRows = computed(() => rows.value)
async function load(){
  loading.value = true; error.value = null
  try{ const res = await reportService.certificates(filters.value); rows.value = res.data.rows }
  catch(e){ error.value = e.response?.data?.error?.message || 'Failed to load' }
  finally{ loading.value = false }
}
async function exportCsv(){
  try{
    const resp = await reportService.certificatesExport(filters.value)
    const blob = new Blob([resp.data], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='certificates.csv'; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Export failed' }
}
function exportExcel(){
  exportToExcel({ columns: headers, rows: filteredRows.value, filename: 'certificates.xlsx' })
}
function exportPdf(){
  exportToPDF({ columns: headers, rows: filteredRows.value, filename: 'certificates.pdf', title: 'Certificate Report' })
}
</script>

