<template>
  <v-container fluid>
    <h1 class="page-title mb-2">Reports</h1>
    <v-card>
      <v-card-title>Leave Reports (CSC Compliance)</v-card-title>
      <v-card-text>
            <v-row>
          <v-col cols="12" md="2"><v-text-field v-model.number="filters.year" label="Year" type="number" /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.leaveType" :items="leaveTypes" label="Leave Type" clearable /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.status" :items="statuses" label="Status" clearable /></v-col>
          <v-col cols="12" md="4" class="d-flex align-end gap-2">
            <v-btn color="primary" @click="load" aria-label="Run report">Run</v-btn>
            <v-spacer />
            <v-btn variant="tonal" @click="exportExcel" aria-label="Export to Excel">Export Excel</v-btn>
            <v-btn variant="tonal" @click="exportPdf" aria-label="Export to PDF">Export PDF</v-btn>
            <v-btn variant="text" @click="exportCsv" aria-label="Export CSV">CSV</v-btn>
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
const filters = ref({ year: new Date().getFullYear(), leaveType: '', status: '' })
const leaveTypes = ['VL','SL','SPL','Maternity','Paternity']
const statuses = ['Pending','Approved','Denied']
const rows = ref([])
const loading = ref(false)
const error = ref(null)
const headers = [
  { title: 'Employee', key: 'employeeName' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Year', key: 'year' },
  { title: 'Accrued YTD', key: 'accruedYtd' },
  { title: 'Used YTD', key: 'usedYtd' },
  { title: 'VL Ending', key: 'vlEndingBalance' },
  { title: 'SL Ending', key: 'slEndingBalance' }
]
const filteredRows = computed(() => rows.value) // placeholder for in-memory filters if API lacks support
async function load(){
  loading.value = true; error.value = null
  try{ const res = await reportService.leave(filters.value); rows.value = res.data.rows }
  catch(e){ error.value = e.response?.data?.error?.message || 'Failed to load' }
  finally{ loading.value = false }
}
async function exportCsv(){
  try{
    const resp = await reportService.leaveExport(filters.value)
    const blob = new Blob([resp.data], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='leave_report.csv'; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Export failed' }
}
function exportExcel(){
  exportToExcel({ columns: headers, rows: filteredRows.value, filename: 'leave_report.xlsx' })
}
function exportPdf(){
  exportToPDF({ columns: headers, rows: filteredRows.value, filename: 'leave_report.pdf', title: 'Leave Report (CSC)' })
}
</script>

